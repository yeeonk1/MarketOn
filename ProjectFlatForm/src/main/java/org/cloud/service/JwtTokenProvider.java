package org.cloud.service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

	
	private final Key key;
	private final long EXPIRATION_TIME = 3600000;
	
	public JwtTokenProvider(@Value("${jwt.secret}") String secret) {
		this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}
	
	public String createToken(String id) {
		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);
		
		return Jwts.builder()
				.setSubject(id)
				.setIssuedAt(now)
				.setExpiration(expiryDate)
				.signWith(key)
				.compact();
	}
}
