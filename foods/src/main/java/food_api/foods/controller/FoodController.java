package food_api.foods.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import food_api.foods.io.FoodResponse;
import food_api.foods.request.FoodRequest;
import food_api.foods.service.FoodService;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/foods")
@AllArgsConstructor
@CrossOrigin("*")
public class FoodController {

    private final FoodService foodService;

    // --- THÊM MÓN ĂN ---
    @PostMapping
    public FoodResponse addFood(@RequestPart("food") String foodString,
                                @RequestPart("file") MultipartFile file){
        FoodRequest request = parseJson(foodString);
        return foodService.addFood(request, file);
    }

    // --- CẬP NHẬT MÓN ĂN (MỚI THÊM) ---
    @PutMapping("/{id}")
    public FoodResponse updateFood(@PathVariable String id,
                                   @RequestPart("food") String foodString,
                                   @RequestPart(value = "file", required = false) MultipartFile file) {
        FoodRequest request = parseJson(foodString);
        // Gọi service xử lý cập nhật (bao gồm logic kiểm tra file ảnh có null hay không)
        return foodService.updateFood(id, request, file);
    }

    @GetMapping
    public List<FoodResponse> readFoods() {
        return foodService.readFoods();
    }

    @GetMapping("/{id}")
    public FoodResponse readFood(@PathVariable String id){
        return foodService.readFood(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFood(@PathVariable String id){
        foodService.deleteFood(id);
    }

    // Hàm bổ trợ để tránh lặp code parse JSON
    private FoodRequest parseJson(String foodString) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(foodString, FoodRequest.class);
        } catch (JsonProcessingException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Định dạng JSON không hợp lệ");
        }
    }
}