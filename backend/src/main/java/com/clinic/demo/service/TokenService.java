package com.clinic.demo.service;

import com.clinic.demo.models.entity.RoleEntity;
import com.clinic.demo.models.entity.user.BaseUserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@Service
public class TokenService {
    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;

    @Autowired
    public TokenService(JwtEncoder jwtEncoder, JwtDecoder jwtDecoder) {
        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
    }

    public String generateJWT(Authentication auth) {
        BaseUserEntity user = (BaseUserEntity) auth.getPrincipal();
        return generateJWT(user);
    }

    public String generateJWT(BaseUserEntity user) {
        return createTokenFromUser(user);
    }

    private String createTokenFromUser(BaseUserEntity user) {
        Instant now = Instant.now();

        String roles = user.getRoles().stream()
                .map(RoleEntity::getName) // Assuming RoleEntity has getName() method
                .collect(Collectors.joining(","));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("clinic-app")
                .issuedAt(now)
                .expiresAt(now.plus(60, ChronoUnit.MINUTES))
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("userType", user.getUserType().name())
                .claim("firstName", user.getFirstName())
                .claim("lastName", user.getLastName())
                .claim("roles", roles)
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}