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
        "/api/auth/register",
        "/api/csrf"
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
        
        // STRICT: /api/auth/login, /api/auth/register and /api/csrf
        // Allow if:
        // 1. Request has Origin header that equals allowedOrigin (cross-origin from frontend), OR
        // 2. Request has NO Origin header AND Referer indicates same-origin (same-origin requests from pages served by this server)
        if (isStrictProtectedPath) {
            String referer = request.getHeader("Referer");
            String scheme = request.getScheme();
            String serverOrigin = scheme + "://" + request.getServerName();
            int port = request.getServerPort();
            if (!(("http".equalsIgnoreCase(scheme) && port == 80) || ("https".equalsIgnoreCase(scheme) && port == 443))) {
                serverOrigin += ":" + port;
            }

            if (origin != null) {
                // Cross-origin request: Origin header must match allowedOrigin
                if (!origin.equals(allowedOrigin)) {
                    logger.warn("Rejected request from unauthorized origin: " + origin + " for path: " + requestPath + ". Allowed origin: " + allowedOrigin);
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("Origin not allowed");
                    return;
                }
            } else {
                // Same-origin request (no Origin header): verify Referer matches server origin or allowed origin (for proxied requests)
                boolean refererMatches = (referer != null) && (referer.startsWith(serverOrigin) || referer.startsWith(allowedOrigin));
                if (!refererMatches) {
                    logger.warn("Rejected request to " + requestPath + " - no Origin header and Referer mismatch. referer=" + referer + ", serverOrigin=" + serverOrigin + ", allowedOrigin=" + allowedOrigin);
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("Origin header is required or Referer must be from same origin or allowed origin");
                    return;
                }
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
