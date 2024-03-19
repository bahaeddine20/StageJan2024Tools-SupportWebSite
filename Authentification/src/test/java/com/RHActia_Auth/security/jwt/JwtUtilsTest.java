//package com.RHActia_Auth.actia_app_Auth.security.jwt;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import java.util.Date;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//public class JwtUtilsTest {
//
//    @Test
//    public void testGenerateJwtToken() {
//        // Mock authentication
//        UserDetails userDetails = User.withUsername("testuser").password("password").authorities("ROLE_USER").build();
//        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null);
//
//        // Create JwtUtils instance with test secret and expiration time
//        JwtUtils jwtUtils = new JwtUtils("test_secret", 3600000);
//
//        // Generate token
//        String token = jwtUtils.generateJwtToken(authentication);
//
//        // Verify token
//        assertNotNull(token);
//        assertTrue(token.length() > 0);
//    }
//
//    @Test
//    public void testGetUserNameFromJwtToken_ValidToken() {
//        // Create JwtUtils instance with test secret
//        JwtUtils jwtUtils = new JwtUtils("test_secret", 3600000);
//
//        // Generate token
//        String token = jwtUtils.generateJwtToken(createAuthentication("testuser"));
//
//        // Extract username from token
//        String username = jwtUtils.getUserNameFromJwtToken(token);
//
//        // Verify username
//        assertEquals("testuser", username);
//    }
//
//    @Test
//    public void testValidateJwtToken_ValidToken() {
//        // Create JwtUtils instance with test secret
//        JwtUtils jwtUtils = new JwtUtils("test_secret", 3600000);
//
//        // Generate token
//        String token = jwtUtils.generateJwtToken(createAuthentication("testuser"));
//
//        // Validate token
//        boolean isValid = jwtUtils.validateJwtToken(token);
//
//        // Verify validation result
//        assertTrue(isValid);
//    }
//
//    @Test
//    public void testValidateJwtToken_ExpiredToken() {
//        // Create JwtUtils instance with test secret
//        JwtUtils jwtUtils = new JwtUtils("test_secret", 3600000);
//
//        // Generate expired token
//        String token = jwtUtils.generateJwtToken(createAuthentication("testuser"));
//        token += "expired"; // Manipulate token to make it expired
//
//        // Validate token
//        boolean isValid = jwtUtils.validateJwtToken(token);
//
//        // Verify validation result
//        assertFalse(isValid);
//    }
//
//    // Helper method to create authentication object
//    private Authentication createAuthentication(String username) {
//        UserDetails userDetails = User.withUsername(username).password("password").authorities("ROLE_USER").build();
//        return new UsernamePasswordAuthenticationToken(userDetails, null);
//    }
//}
