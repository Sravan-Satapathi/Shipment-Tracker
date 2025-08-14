package com.sravan.shipment.authentication.exception;

import org.springframework.http.HttpStatus;
import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    private final HttpStatus status;
    private final String message;
    public BusinessException(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }
}
