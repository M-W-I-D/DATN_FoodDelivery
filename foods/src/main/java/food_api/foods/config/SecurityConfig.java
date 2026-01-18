package food_api.foods.config;

import food_api.foods.filters.JwtAuthenticationFilter;
import food_api.foods.service.AppUserDetailsService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    private final AppUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // 1. CÔNG KHAI (Public)
                        .requestMatchers("/api/register", "/api/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/foods/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/comments/food/**").permitAll()
                        .requestMatchers("/api/orders/verify").permitAll()
                        .requestMatchers("/images/**").permitAll()

                        // 2. QUYỀN ADMIN (Dành cho trang Admin cổng 5174)
                        // Món ăn: POST, PUT, DELETE
                        .requestMatchers(HttpMethod.POST, "/api/foods/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/foods/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/foods/**").hasAuthority("ADMIN")

                        // Đơn hàng: Xem tất cả và cập nhật trạng thái (Dùng cả PUT và PATCH cho chắc chắn)
                        .requestMatchers("/api/orders/all").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/orders/status/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/orders/status/**").hasAuthority("ADMIN")

                        // 3. QUYỀN USER & ADMIN (Đã đăng nhập)
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers("/api/orders/create", "/api/orders").authenticated()
                        .requestMatchers("/api/comments/add").authenticated()
                        .requestMatchers("/api/comments/delete/**").authenticated()

                        // Tất cả các yêu cầu khác
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Cho phép cả 2 cổng React: 5173 (User) và 5174 (Admin)
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(authProvider);
    }
}