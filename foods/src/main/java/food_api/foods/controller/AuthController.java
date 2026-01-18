package food_api.foods.controller;

import food_api.foods.entity.UserEntity;
import food_api.foods.io.AuthenticationRequest;
import food_api.foods.io.AuthenticationResponse;
import food_api.foods.repository.UserRepository;
import food_api.foods.service.AppUserDetailsService;
import food_api.foods.util.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@AllArgsConstructor // Sử dụng Lombok để tự động tạo Constructor injection cho gọn
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
    private final UserRepository userRepository; // Cần cái này để lấy Role từ DB
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest request) throws Exception {
        try {
            // 1. Xác thực Email và Mật khẩu thông qua Spring Security
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            // 2. Ném lỗi rõ ràng để Frontend dễ bắt
            throw new Exception("Email hoặc mật khẩu không chính xác", e);
        }

        // 3. Lấy thông tin UserDetails để tạo Token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());

        // 4. Tìm UserEntity trong Database để lấy thêm thông tin Role và Name
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng"));

        // 5. Tạo JWT token
        final String jwtToken = jwtUtil.generateToken(userDetails);

        // 6. Trả về đầy đủ thông tin (Token, Email, Role, Name)
        return AuthenticationResponse.builder()
                .email(user.getEmail())
                .token(jwtToken)
                .role(user.getRole()) // Trả về "ADMIN" hoặc "USER"
                .name(user.getName())
                .build();
    }
}