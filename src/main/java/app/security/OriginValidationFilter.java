package app.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Filter to validate request origin and reject requests from non-allowed origins
 * for sensitive endpoints.
 */
@Component
public class OriginValidationFilter extends OncePerRequestFilter {

    @Value("${app.security.allowed-origin}")
    private String allowedOrigin;

    // Paths that require origin validation (stricter enforcement)
    private static final String[] PROTECTED_PATHS = {
        "/api/user",
        "/api/auth/logout",
        "/api/demo"
    };

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String origin = request.getHeader("Origin");
        String requestPath = request.getRequestURI();
        
        // Check if this request path needs origin validation
        boolean isProtectedPath = false;
        for (String path : PROTECTED_PATHS) {
            if (requestPath.startsWith(path)) {
                isProtectedPath = true;
                break;
            }
        }
        
        // If protected path and origin is present, validate it
        if (isProtectedPath && origin != null) {
            if (!origin.equals(allowedOrigin)) {
                logger.warn("Rejected request from unauthorized origin: " + origin + " for path: " + requestPath);
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("Origin not allowed");
                return;
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
