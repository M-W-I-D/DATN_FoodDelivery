package food_api.foods.repository;

import food_api.foods.entity.CommentEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<CommentEntity, String> {

    // 1. Dùng để tính toán Rating trung bình (không cần sắp xếp cho nhanh)
    List<CommentEntity> findByFoodId(String foodId);

    // 2. Dùng để hiển thị danh sách bình luận ở trang chi tiết (cần sắp xếp mới nhất lên đầu)
    List<CommentEntity> findByFoodIdOrderByCreatedAtDesc(String foodId);
}