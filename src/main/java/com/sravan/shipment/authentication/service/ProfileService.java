package com.sravan.shipment.authentication.service;


import com.sravan.shipment.authentication.dto.ProfileRequest;
import com.sravan.shipment.authentication.dto.ProfileResponse;

public interface ProfileService {

    ProfileResponse createProfile(ProfileRequest request);
    ProfileResponse getProfile(String email);
    void sendResetOtp(String email);
    void resetPassword(String email, String otp, String newPassword);
    void sendOtp(String email);
    void verifyOtp(String email, String otp);
}
