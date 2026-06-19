package com.smartlearning.backend.service;

import com.smartlearning.backend.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expirationMs}")
    private long expirationMs;

    public String generateToken(User user) {
        Date now = new Date();
        return Jwts.builder()
                .setSubject(user.username)
                .claim("id", user.id)
                .claim("role", user.role.name())
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + expirationMs))
                .signWith(signingKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String extractUsername(String token) {
        return claims(token).getSubject();
    }

    public boolean isValid(String token) {
        try {
            return claims(token).getExpiration().after(new Date());
        } catch (Exception ex) {
            return false;
        }
    }

    private Claims claims(String token) {
        return Jwts.parserBuilder().setSigningKey(signingKey()).build().parseClaimsJws(token).getBody();
    }

    private Key signingKey() {
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secret);
        } catch (IllegalArgumentException ex) {
            keyBytes = secret.getBytes();
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
