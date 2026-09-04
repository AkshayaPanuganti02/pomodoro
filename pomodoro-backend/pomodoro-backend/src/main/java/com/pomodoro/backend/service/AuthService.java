package com.pomodoro.backend.service;

import com.pomodoro.backend.dto.AuthRequest;
import com.pomodoro.backend.dto.AuthResponse;
import com.pomodoro.backend.model.User;
import com.pomodoro.backend.repository.UserRepository;
import com.pomodoro.backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(AuthRequest request) {

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with that email already exists");
        }

        // Password is hashed here - the plain-text value is discarded immediately after
        String hash = passwordEncoder.encode(request.getPassword());

        User user = new User(normalizedEmail, hash);
        userRepository.save(user);

        String token = jwtUtil.generateToken(normalizedEmail);
        return new AuthResponse(token, normalizedEmail);
    }

    public AuthResponse login(AuthRequest request) {

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            // Deliberately identical error message/status to the "no such user" case above,
            // so failed login attempts can't be used to discover which emails have accounts.
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String token = jwtUtil.generateToken(normalizedEmail);
        return new AuthResponse(token, normalizedEmail);
    }
}
