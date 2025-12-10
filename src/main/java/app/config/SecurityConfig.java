package app.config;

import app.security.JwtAuthenticationFilter;
import app.security.OriginValidationFilter;
import app.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OriginValidationFilter originValidationFilter;
    private final CorsConfigurationSource corsConfigurationSource;
    private final CookieCsrfTokenRepository csrfTokenRepository;
    private final CsrfTokenRequestAttributeHandler csrfTokenRequestHandler;
    private final RequestMatcher csrfIgnoreMatcher;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          OriginValidationFilter originValidationFilter,
                          CorsConfigurationSource corsConfigurationSource,
                          CookieCsrfTokenRepository csrfTokenRepository,
                          CsrfTokenRequestAttributeHandler csrfTokenRequestHandler,
                          RequestMatcher csrfIgnoreMatcher) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.originValidationFilter = originValidationFilter;
        this.corsConfigurationSource = corsConfigurationSource;
        this.csrfTokenRepository = csrfTokenRepository;
        this.csrfTokenRequestHandler = csrfTokenRequestHandler;
        this.csrfIgnoreMatcher = csrfIgnoreMatcher;
    }

    private static final String[] PUBLIC_ENDPOINTS = {
        "/", "/index.html", "/static/**", "/assets/**",
        "/*.js", "/*.css", "/*.json", "/*.png", "/*.jpg",
        "/*.jpeg", "/*.gif", "/*.svg", "/*.ico",
        "/favicon.ico", "/error",
        "/api/csrf","/api/message",
        "/about", "/login", "/register", "/user"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   DaoAuthenticationProvider authProvider) throws Exception {
        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(csrfTokenRepository)
                .csrfTokenRequestHandler(csrfTokenRequestHandler)
                .ignoringRequestMatchers(csrfIgnoreMatcher)
                .ignoringRequestMatchers("/api/**") // ignore CSRF for JWT endpoints
            )
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authProvider)
            .addFilterBefore(originValidationFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(CustomUserDetailsService userDetailsService,
                                                            PasswordEncoder passwordEncoder) {
        // Constructor requires a UserDetailsService
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }
}
