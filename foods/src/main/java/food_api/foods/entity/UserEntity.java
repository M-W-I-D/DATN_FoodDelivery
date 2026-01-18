package food_api.foods.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "user")
@Builder
public class UserEntity {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;

    // THÊM TRƯỜNG NÀY: Mặc định là USER
    @Builder.Default
    private String role = "USER";

    @Builder.Default
    private Map<String, Integer> cartData = new HashMap<>();
}