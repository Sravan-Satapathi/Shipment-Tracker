package com.sravan.shipment.authentication.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;


@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail,String otp) throws MessagingException {
        Context context=new Context();
        context.setVariable("email",toEmail);
        context.setVariable("otp",otp);

        String process=templateEngine.process("verify-email",context);
        MimeMessage mimeMessage=mailSender.createMimeMessage();
        MimeMessageHelper helper=new MimeMessageHelper(mimeMessage);

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Account Verification OTP");
        helper.setText(process,true);

        mailSender.send(mimeMessage);
    }

    public void sendResetOtpEmail(String toEmail,String otp) throws MessagingException {
        Context context=new Context();
        context.setVariable("email",toEmail);
        context.setVariable("otp",otp);

        String process=templateEngine.process("password-reset-email",context);
        MimeMessage mimeMessage=mailSender.createMimeMessage();
        MimeMessageHelper helper=new MimeMessageHelper(mimeMessage);

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Forgot your password?");
        helper.setText(process,true);

        System.out.println("Sending password reset email to: " + toEmail);
        mailSender.send(mimeMessage);
    }
}
