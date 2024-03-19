//package com.RHActia_Auth.security.jwt;
//
//import com.RHActia_Auth.actia_app_Auth.security.jwt.AuthTokenFilter;
//import com.RHActia_Auth.actia_app_Auth.security.jwt.JwtUtils;
//import com.RHActia_Auth.actia_app_Auth.security.services.UserDetailsServiceImpl;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//
//import javax.servlet.FilterChain;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//
//import static org.mockito.Mockito.*;
//
//public class AuthTokenFilterTest {
//
//    @InjectMocks
//    private AuthTokenFilter authTokenFilter;
//
//    @Mock
//    private HttpServletRequest request;
//
//    @Mock
//    private HttpServletResponse response;
//
//    @Mock
//    private FilterChain filterChain;
//
//    @Mock
//    private JwtUtils jwtUtils;
//
//    @Mock
//    private UserDetailsServiceImpl userDetailsService;
//
//    @Test
//    public void testDoFilterInternal_ValidToken() throws Exception {
//        MockitoAnnotations.initMocks(this);
//
//        // Mock JWT validation
//        when(jwtUtils.validateJwtToken("valid_token")).thenReturn(true);
//        when(jwtUtils.getUserNameFromJwtToken("valid_token")).thenReturn("testuser");
//
//        // Mock UserDetails
//        UserDetails userDetails = User.withUsername("testuser").password("password").authorities("ROLE_USER").build();
//        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);
//
//        // Mock request
//        when(request.getHeader("Authorization")).thenReturn("Bearer valid_token");
//        when(request.getRequestURI()).thenReturn("/api/some-endpoint");
//
//        // Invoke method
//        authTokenFilter.doFilter(request, response, filterChain);
//
//        // Verify authentication setup
//        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
//                userDetails, null, userDetails.getAuthorities());
//        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//        verify(userDetailsService, times(1)).loadUserByUsername("testuser");
//        verify(filterChain, times(1)).doFilter(request, response);
//    }
//
//    // Add more test cases to cover different scenarios
//}
