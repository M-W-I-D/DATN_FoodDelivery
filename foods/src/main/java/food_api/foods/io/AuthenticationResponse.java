package food_api.foods.io;

import lombok.AllArgsConstructor;
import lombok.Builder; // Thêm dòng này
import lombok.Data;    // Sử dụng @Data thay cho @Getter để có đủ Setter/Getter
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder // THÊM DÒNG NÀY ĐỂ HẾT LỖI .builder()
public class AuthenticationResponse {
    private String email;
    private String token;
    private String role;
    private String name;
}