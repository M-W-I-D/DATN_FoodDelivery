package food_api.foods.controller;

import food_api.foods.entity.CommentEntity;
import food_api.foods.repository.CommentRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@AllArgsConstructor
@CrossOrigin("*")
public class CommentController {
    private final CommentRepository commentRepository;

    @GetMapping("/food/{foodId}")
    public ResponseEntity<List<CommentEntity>> getCommentsByFood(@PathVariable String foodId) {
        return ResponseEntity.ok(commentRepository.findByFoodIdOrderByCreatedAtDesc(foodId));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addComment(@RequestBody CommentEntity comment) {
        comment.setId(null); // Đảm bảo MongoDB tự tạo ID mới
        comment.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(commentRepository.save(comment));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id) {
        commentRepository.deleteById(id);
        return ResponseEntity.ok("Đã xóa bình luận thành công");
    }
}