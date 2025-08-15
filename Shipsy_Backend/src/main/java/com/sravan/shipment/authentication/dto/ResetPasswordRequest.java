package com.sravan.shipment.authentication.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordRequest {

    @NotBlank(message = "Password cannot be empty is required")
    @Size(min = 6, message = "Password must be atleast 6 characters")
    private String newPassword;
    @NotBlank(message = "OTP is required")
    private String otp;
    @NotBlank(message = "Email is required")
    private String email;
}
