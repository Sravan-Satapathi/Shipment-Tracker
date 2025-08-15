package com.sravan.shipment.authentication.controller;

import com.sravan.shipment.authentication.entity.UserEntity;
import com.sravan.shipment.authentication.exception.BusinessException;
import com.sravan.shipment.authentication.dto.AuthRequest;
import com.sravan.shipment.authentication.dto.AuthResponse;
import com.sravan.shipment.authentication.dto.ResetPasswordRequest;
import com.sravan.shipment.authentication.repository.UserRepository;
import com.sravan.shipment.authentication.service.AppUserDetailsService;
import com.sravan.shipment.authentication.service.ProfileService;
import com.sravan.shipment.authentication.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final JwtUtil jwtUtil;
    private final ProfileService profileService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        UserEntity existingUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: "+request.getEmail()));
        try {
            authenticate(request.getEmail(), request.getPassword());
            final UserDetails userDetails = appUserDetailsService.loadUserByUsername(request.getEmail());
            final String jwtToken = jwtUtil.generateToken(userDetails);
            ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                    .httpOnly(true)
                    .path("/")
                    .maxAge(Duration.ofDays(1))
                    .sameSite("Strict")
                    .build();
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new AuthResponse(request.getEmail(), jwtToken));
        } catch(BadCredentialsException ex) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", "Email or password is incorrect");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch(DisabledException ex) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", "Account is disabled");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }catch(Exception ex) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", "Authentication failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    private void authenticate(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }

    @GetMapping("/is-authenticated")
    public ResponseEntity<Boolean> isAuthenticated(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        return ResponseEntity.ok(email != null);
    }

    @PostMapping("/send-reset-otp")
    public void sendResetOtp(@Valid @RequestParam String email) {
        profileService.sendResetOtp(email);
    }

    @PostMapping("/reset-password")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        profileService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
    }

    @PostMapping("/send-otp")
    public void sendVerifyOtp(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        profileService.sendOtp(email);
    }

    @PostMapping("/verify-otp")
    public void verifyEmail(@Valid @RequestBody Map<String, Object> request,
                            @CurrentSecurityContext(expression = "authentication?.name") String email) {
        if (request.get("otp").toString() == null) {
            throw new BusinessException("Missing Details",HttpStatus.INTERNAL_SERVER_ERROR);
        }
        profileService.verifyOtp(email, request.get("otp").toString());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out successfully!");
    }
}
