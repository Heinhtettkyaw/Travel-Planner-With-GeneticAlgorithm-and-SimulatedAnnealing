package com.example.auth.controller;

import com.example.auth.config.JwtUtil;
import com.example.auth.model.Role;
import com.example.auth.model.User;
import com.example.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody Map<String, String> userData) {
//        try {
//            String username = userData.get("username");
//            String password = userData.get("password");
//            String roleStr = userData.get("role");
//            if (userRepository.findByUsername(username).isPresent()) {
//                return ResponseEntity.badRequest().body(Map.of("error", "Username already exists."));
//            }
//
//            User newUser = new User();
//            newUser.setUsername(username);
//            newUser.setPassword(passwordEncoder.encode(password));
//            newUser.setRole(Role.USER);
//            userRepository.save(newUser);
//            return ResponseEntity.ok(Map.of("message", "User registered successfully."));
//        } catch (Exception ex) {
//            ex.printStackTrace();
//            return ResponseEntity.status(500).body(Map.of("error", "Registration failed", "message", ex.getMessage()));
//        }
//    }
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody Map<String, String> userData) {
    try {
        String username = userData.get("username");
        String password = userData.get("password");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists."));
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        // Always set role to USER for registration.
        newUser.setRole(Role.USER);

        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("message", "User registered successfully."));
    } catch (Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(500).body(Map.of("error", "Registration failed", "message", ex.getMessage()));
    }
}
}
