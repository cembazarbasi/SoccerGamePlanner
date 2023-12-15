package com.bayareasoccerevents.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bayareasoccerevents.models.PasswordResetToken;
import com.bayareasoccerevents.models.User;
import com.bayareasoccerevents.services.AuthService;
import com.bayareasoccerevents.services.AuthServiceImpl;
import com.bayareasoccerevents.services.EmailService;
import com.bayareasoccerevents.services.PasswordResetTokenService;

@RestController
@RequestMapping("/reset-password")
@CrossOrigin(origins= "http://bayareasoccerevents.com/*" )
public class PasswordResetController {

    @Autowired
    private PasswordResetTokenService tokenService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuthServiceImpl userService;

    @PostMapping("/request")
    public ResponseEntity<String> requestPasswordReset(@RequestParam String email) {
    	
    	
        User user = userService.findByEmail(email);
        if (user != null) {
            String token = generateUniqueToken(); // Implement this method
            PasswordResetToken resetToken = tokenService.createToken(user, token);
            String resetLink = "http://bayareasoccerevents.com/reset-password/reset?token=" + token;
            //String resetLink = "http://localhost:4200/reset-password/reset?token=" + token;
            emailService.sendPasswordResetEmail(user, resetLink);
            
           
            
        	System.out.println("Password reset email sent successfully for user: " + user.getEmail());
        	
            return ResponseEntity.ok("Password reset email sent successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
    
    private String generateUniqueToken() {        
        return UUID.randomUUID().toString();
    }

    

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        PasswordResetToken resetToken = tokenService.findByToken(token);
        
        if (resetToken != null && !resetToken.isTokenExpired()) {
            User user = resetToken.getUser();
            userService.updatePassword(user, newPassword);
            tokenService.deleteToken(resetToken);                   	
        	
            return ResponseEntity.ok("Password reset successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
        }
    }

	
    @GetMapping("/reset")
    public ResponseEntity<String> showResetForm(@RequestParam String token, Model model) {
	    PasswordResetToken resetToken = tokenService.findByToken(token);

	    if (resetToken != null && !resetToken.isTokenExpired()) {
	       
	        model.addAttribute("token", token);

	        
	        return ResponseEntity.ok(token); 
	    } else {
	        return ResponseEntity.ok(token) ;
	    }
	}

	
	
}
