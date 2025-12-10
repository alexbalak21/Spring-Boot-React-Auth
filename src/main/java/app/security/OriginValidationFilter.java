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

    // Paths that ALWAYS require origin validation (must match allowed origin)
    private static final String[] STRICT_PROTECTED_PATHS = {
        "/api/auth/login",
        "/api/auth/register"
    };

    // Paths that only validate origin if it's present
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
        
        // Check if this is a STRICT protected path (MUST have origin that matches)
        boolean isStrictProtectedPath = false;
        for (String path : STRICT_PROTECTED_PATHS) {
            if (requestPath.startsWith(path)) {
                isStrictProtectedPath = true;
                break;
            }
        }
        
        // Check if this is a regular protected path (validate origin if present)
        boolean isProtectedPath = false;
        for (String path : PROTECTED_PATHS) {
            if (requestPath.startsWith(path)) {
                isProtectedPath = true;
                break;
            }
        }
        
        // STRICT: /api/auth/login and /api/auth/register MUST have valid origin
        if (isStrictProtectedPath) {
            if (origin == null) {
                logger.warn("Rejected request to " + requestPath + " - no Origin header present");
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("Origin header is required");
                return;
            }
            if (!origin.equals(allowedOrigin)) {
                logger.warn("Rejected request from unauthorized origin: " + origin + " for path: " + requestPath + ". Allowed origin: " + allowedOrigin);
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("Origin not allowed");
                return;
            }
        }
        
        // LENIENT: Other protected paths only validate if origin is present
        if (isProtectedPath && origin != null) {
            if (!origin.equals(allowedOrigin)) {
                logger.warn("Rejected request from unauthorized origin: " + origin + " for path: " + requestPath + ". Allowed origin: " + allowedOrigin);
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("Origin not allowed");
                return;
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
