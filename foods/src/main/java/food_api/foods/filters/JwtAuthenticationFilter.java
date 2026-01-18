package food_api.foods.filters;

import food_api.foods.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // 1. Kiểm tra sự tồn tại của Token trong Header
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                String email = jwtUtil.extractUsername(token);

                // 2. Nếu có email và chưa được xác thực trong phiên làm việc này
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                    // 3. Kiểm tra tính hợp lệ của Token (hết hạn, khớp user)
                    if (jwtUtil.validateToken(token, userDetails)) {

                        // ⭐ DEBUG: In ra quyền hạn để kiểm tra lỗi 403
                        System.out.println("--- JWT DEBUG ---");
                        System.out.println("User: " + email);
                        System.out.println("Authorities từ DB: " + userDetails.getAuthorities());

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );

                        authentication.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request)
                        );

                        // 4. Lưu thông tin xác thực vào SecurityContext
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        System.out.println("Xác thực thành công cho: " + email);
                    }
                }
            } catch (Exception e) {
                System.err.println("Lỗi xác thực JWT: " + e.getMessage());
            }
        }

        // 5. Cho phép Request đi tiếp đến Controller hoặc Filter tiếp theo
        filterChain.doFilter(request, response);
    }
}