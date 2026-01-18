package food_api.foods.service;

import food_api.foods.entity.CommentEntity;
import food_api.foods.entity.FoodEntity;
import food_api.foods.io.FoodResponse;
import food_api.foods.repository.CommentRepository;
import food_api.foods.repository.FoodRepository;
import food_api.foods.request.FoodRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodServiceImpl implements FoodService {

    private final S3Client s3Client;
    private final FoodRepository foodRepository;
    private final CommentRepository commentRepository;

    @Value("${aws.s3.bucketname}")
    private String bucketName;

    @Value("${aws.region}")
    private String region;

    /* =========================
        1. XỬ LÝ TỆP TIN (AWS S3)
       ========================= */

    @Override
    public String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tệp tin hình ảnh không được để trống.");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";

        String key = UUID.randomUUID().toString() + extension;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl("public-read")
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi S3: " + ex.getMessage());
        }
    }

    @Override
    public boolean deleteFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) return false;
        try {
            String key = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /* =========================
        2. QUẢN LÝ MÓN ĂN (CRUD)
       ========================= */

    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile file) {
        String imageUrl = uploadFile(file);
        FoodEntity foodEntity = convertToEntity(request);
        foodEntity.setImageUrl(imageUrl);

        FoodEntity savedFood = foodRepository.save(foodEntity);
        return convertToResponse(savedFood);
    }

    @Override
    public List<FoodResponse> readFoods() {
        return foodRepository.findAll().stream()
                .map(this::convertToResponse) // Tự động tính rating cho từng món
                .collect(Collectors.toList());
    }

    @Override
    public FoodResponse readFood(String id) {
        FoodEntity food = foodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ID không tồn tại: " + id));
        return convertToResponse(food);
    }

    @Override
    public FoodResponse updateFood(String id, FoodRequest request, MultipartFile file) {
        FoodEntity existingFood = foodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy món ăn."));

        existingFood.setName(request.getName());
        existingFood.setDescription(request.getDescription());
        existingFood.setCategory(request.getCategory());
        existingFood.setPrice(request.getPrice());

        if (file != null && !file.isEmpty()) {
            deleteFile(existingFood.getImageUrl());
            existingFood.setImageUrl(uploadFile(file));
        }

        return convertToResponse(foodRepository.save(existingFood));
    }

    @Override
    public void deleteFood(String id) {
        FoodEntity food = foodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy món ăn để xóa."));
        deleteFile(food.getImageUrl());
        foodRepository.deleteById(id);
    }

    /* =========================
        3. CHUYỂN ĐỔI DỮ LIỆU & RATING
       ========================= */

    private FoodEntity convertToEntity(FoodRequest request) {
        return FoodEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .build();
    }

    /**
     * Chuyển đổi Entity sang Response kèm theo tính toán điểm đánh giá trung bình
     */
    private FoodResponse convertToResponse(FoodEntity entity) {
        // Lấy danh sách bình luận của món ăn
        List<CommentEntity> comments = commentRepository.findByFoodId(entity.getId());

        // Tính toán điểm trung bình
        double averageRating = comments.stream()
                .mapToInt(CommentEntity::getRating)
                .average()
                .orElse(0.0);

        // Làm tròn đến 1 chữ số thập phân
        double roundedRating = Math.round(averageRating * 10.0) / 10.0;

        return FoodResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .category(entity.getCategory())
                .price(entity.getPrice())
                .imageUrl(entity.getImageUrl())
                .averageRating(roundedRating) // Gán giá trị vào DTO
                .totalReviews(comments.size()) // Thêm thông tin tổng số lượt đánh giá
                .build();
    }
}