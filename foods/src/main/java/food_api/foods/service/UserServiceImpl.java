package food_api.foods.service;

import food_api.foods.entity.UserEntity;
import food_api.foods.io.UserRequest;
import food_api.foods.io.UserResponse;
import food_api.foods.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {



    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationFacade authenticationFacade;

    @Override
    public UserResponse registerUser(UserRequest request) {
        UserEntity newUser = convertToEntity(request);
        newUser = userRepository.save(newUser);
        return convertToResponse(newUser);
    }

    @Override
    public String findByUserId() {
        // Lấy authentication từ facade
        org.springframework.security.core.Authentication auth = authenticationFacade.getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Người dùng chưa đăng nhập");
        }

        String email = auth.getName();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy User với email: " + email));

        return user.getId();
    }

    private UserEntity convertToEntity(UserRequest request) {
        // Phải có từ khóa return ở đây
        return UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .build();
    }

    private UserResponse convertToResponse(UserEntity registeredUser) {
        return UserResponse.builder()
                .id(registeredUser.getId())
                .name(registeredUser.getName())
                .email(registeredUser.getEmail())
                .build();
    }
}
