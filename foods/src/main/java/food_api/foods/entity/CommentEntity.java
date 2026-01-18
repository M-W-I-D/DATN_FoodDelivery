package food_api.foods.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document; // Dùng cho MongoDB
import java.time.LocalDateTime;

@Document(collection = "comments") // Khai báo collection trong MongoDB
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentEntity {
    @Id
    private String id; // MongoDB thường dùng String cho ID tự sinh (ObjectId)

    private String foodId;
    private String userName;
    private String content;
    private int rating;

    // Tự gán thời gian vì MongoDB không có @CreationTimestamp giống JPA
    private LocalDateTime createdAt = LocalDateTime.now();
}