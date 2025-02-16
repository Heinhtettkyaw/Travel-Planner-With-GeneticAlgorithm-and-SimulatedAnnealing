package com.example.auth.service;

import com.example.auth.model.User;
import com.example.auth.model.PasswordChangeRequest;
import com.example.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Method to update user profile
    public void updateUserProfile(User currentUser, User updatedUser) {
        currentUser.setFullName(updatedUser.getFullName());
        currentUser.setEmail(updatedUser.getEmail());
        currentUser.setPhone(updatedUser.getPhone());
        currentUser.setGender(updatedUser.getGender());
        userRepository.save(currentUser);
    }

    // Method to change user password
    public void changePassword(User user, String oldPassword, String newPassword) throws Exception {
        if (passwordEncoder.matches(oldPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        } else {
            throw new Exception("Old password is incorrect");
        }
    }
}
