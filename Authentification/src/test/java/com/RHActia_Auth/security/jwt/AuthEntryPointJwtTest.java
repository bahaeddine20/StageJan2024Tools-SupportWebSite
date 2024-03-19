//package com.RHActia_Auth.security.jwt;
//
//import com.RHActia_Auth.actia_app_Auth.security.jwt.AuthEntryPointJwt;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.slf4j.Logger;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.web.AuthenticationEntryPoint;
//
//import javax.servlet.ServletException;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.IOException;
//
//import static org.mockito.Mockito.verify;
//import static org.mockito.Mockito.when;
//import static org.mockito.MockitoAnnotations.initMocks;
//
//@SpringBootTest
//public class AuthEntryPointJwtTest {
//
//    @InjectMocks
//    private AuthEntryPointJwt authEntryPointJwt;
//
//    @Mock
//    private Logger logger;
//
//    @Mock
//    private HttpServletRequest request;
//
//    @Mock
//    private HttpServletResponse response;
//
//    @Mock
//    private AuthenticationException authenticationException;
//
//    @Test
//    public void testCommence() throws IOException, ServletException {
//        initMocks(this);
//
//        String errorMessage = "Error: Unauthorized";
//        int unauthorizedStatusCode = HttpServletResponse.SC_UNAUTHORIZED;
//
//        when(authenticationException.getMessage()).thenReturn(errorMessage);
//
//        authEntryPointJwt.commence(request, response, authenticationException);
//
//        verify(logger).error("Unauthorized error: {}", errorMessage);
//        verify(response).sendError(unauthorizedStatusCode, errorMessage);
//    }
//}
