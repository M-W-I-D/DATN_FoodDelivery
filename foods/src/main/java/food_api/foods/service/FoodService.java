package food_api.foods.service;

import food_api.foods.io.FoodResponse;
import food_api.foods.request.FoodRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodService {

    /**
     * Tải tệp tin lên hệ thống lưu trữ (AWS S3)
     * @param file Tệp tin hình ảnh từ người dùng
     * @return Đường dẫn URL công khai của tệp tin
     */
    String uploadFile(MultipartFile file);

    /**
     * Xóa tệp tin khỏi hệ thống lưu trữ
     * @param imageUrl Đường dẫn URL của tệp tin cần xóa
     * @return true nếu xóa thành công, ngược lại false
     */
    boolean deleteFile(String imageUrl);

    /**
     * Thêm món ăn mới kèm theo hình ảnh
     */
    FoodResponse addFood(FoodRequest request, MultipartFile file);

    /**
     * Lấy danh sách tất cả món ăn hiện có
     */
    List<FoodResponse> readFoods();

    /**
     * Lấy thông tin chi tiết một món ăn theo ID
     */
    FoodResponse readFood(String id);

    /**
     * Cập nhật thông tin món ăn (hỗ trợ cập nhật ảnh hoặc giữ nguyên ảnh cũ)
     */
    FoodResponse updateFood(String id, FoodRequest request, MultipartFile file);

    /**
     * Xóa hoàn toàn món ăn khỏi Database và xóa ảnh tương ứng trên S3
     */
    void deleteFood(String id);
}