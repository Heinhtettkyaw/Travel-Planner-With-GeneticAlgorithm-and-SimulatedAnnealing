package com.example.auth.controller;

import com.example.auth.config.JwtUtil;
import com.example.auth.model.Role;
import com.example.auth.model.User;
import com.example.auth.repository.UserRepository;
import com.example.auth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.util.Map;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            String token = jwtUtil.generateToken(username);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "role", user.getRole().name()
            ));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(403).body(Map.of("error", "Authentication failed", "message", ex.getMessage()));
        }
    }


@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody Map<String, String> userData) {
    try {
        String username = userData.get("username");
        String password = userData.get("password");
        String confirmPassword = userData.get("confirmPassword");
        String email = userData.get("email");
        String phone = userData.get("phone");
        String gender = userData.get("gender");
        String fullName = userData.get("fullName");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists."));
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        // Always set role to USER for registration.
        newUser.setRole(Role.USER);
        newUser.setEmail(email);
        newUser.setPhone(phone);
        newUser.setGender(gender);
        newUser.setFullName(fullName);
        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("message", "User registered successfully."));
    } catch (Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(500).body(Map.of("error", "Registration failed", "message", ex.getMessage()));
    }
}
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String username = jwtUtil.extractUsername(token.substring(7));
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "phone", user.getPhone(),
                    "gender", user.getGender(),
                    "fullName", user.getFullName()
            ));
        }
        return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
    }
    /**
     * Update User Profile
     */
    @PutMapping("/profile/update")
    public ResponseEntity<Map<String, String>> updateProfile(@RequestHeader("Authorization") String token,
                                                             @RequestBody Map<String, String> userData) {
        if (token != null && token.startsWith("Bearer ")) {
            String username = jwtUtil.extractUsername(token.substring(7));
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update fields based on provided data
            user.setEmail(userData.getOrDefault("email", user.getEmail()));
            user.setPhone(userData.getOrDefault("phone", user.getPhone()));
            user.setGender(userData.getOrDefault("gender", user.getGender()));
            user.setFullName(userData.getOrDefault("fullName", user.getFullName()));

            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
        }
        return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
    }

    /**
     * Change Password
     */
    @PostMapping("/profile/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestHeader("Authorization") String token,
                                                              @RequestBody Map<String, String> passwordData) {
        if (token != null && token.startsWith("Bearer ")) {
            String username = jwtUtil.extractUsername(token.substring(7));
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String oldPassword = passwordData.get("oldPassword");
            String newPassword = passwordData.get("newPassword");
            String confirmPassword = passwordData.get("confirmPassword");

            // Validate old password
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Old password does not match"));
            }

            // Validate new password and confirm password
            if (!newPassword.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body(Map.of("error", "New password and confirm password do not match"));
            }

            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        }
        return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
    }
}
