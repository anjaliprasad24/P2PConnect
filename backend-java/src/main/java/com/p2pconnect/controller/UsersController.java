package com.p2pconnect.controller;

import com.p2pconnect.model.User;
import com.p2pconnect.repository.UserRepository;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public UsersController(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        String name = body.get("name") instanceof String ? (String) body.get("name") : null;
        String email = body.get("email") instanceof String ? (String) body.get("email") : null;
        String phone = body.get("phone") instanceof String ? (String) body.get("phone") : null;
        String hostel = body.get("hostel") instanceof String ? (String) body.get("hostel") : null;
        String password = body.get("password") instanceof String ? (String) body.get("password") : null;

        if (name == null || email == null || phone == null || hostel == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Missing required fields"));
        }
        if (users.findByEmailIgnoreCase(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Email already exists"));
        }
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPhone(phone);
        u.setHostel(hostel);
        u.setPassword(passwordEncoder.encode(password));
        u = users.save(u);
        return ResponseEntity.status(HttpStatus.CREATED).body(u);
    }

    @PostMapping(value = "", consumes = {MediaType.APPLICATION_FORM_URLENCODED_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> createForm(@RequestParam("name") String name,
                                        @RequestParam("email") String email,
                                        @RequestParam("phone") String phone,
                                        @RequestParam("hostel") String hostel,
                                        @RequestParam("password") String password) {
        if (name == null || email == null || phone == null || hostel == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Missing required fields"));
        }
        if (users.findByEmailIgnoreCase(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Email already exists"));
        }
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPhone(phone);
        u.setHostel(hostel);
        u.setPassword(passwordEncoder.encode(password));
        u = users.save(u);
        return ResponseEntity.status(HttpStatus.CREATED).body(u);
    }
}