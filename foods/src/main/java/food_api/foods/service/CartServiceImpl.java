package food_api.foods.service;

import food_api.foods.entity.CartEntity;
import food_api.foods.io.CartRequest;
import food_api.foods.io.CartResponse;
import food_api.foods.repository.CartRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserService userService;

    /**
     * Thêm món ăn hoặc tăng số lượng (+1).
     * Dữ liệu được lưu vào MongoDB ngay lập tức.
     */
    @Override
    public CartResponse addToCart(CartRequest request) {
        String loggedInUserId = userService.findByUserId();
        String foodId = request.getFoodId();

        // Lấy giỏ hàng hiện tại hoặc tạo mới nếu chưa có
        CartEntity cart = cartRepository.findByUserId(loggedInUserId)
                .orElseGet(() -> CartEntity.builder()
                        .userId(loggedInUserId)
                        .items(new HashMap<>())
                        .build());

        Map<String, Integer> cartItems = cart.getItems();

        // Cập nhật Map: nếu đã có thì +1, chưa có thì set là 1
        cartItems.put(foodId, cartItems.getOrDefault(foodId, 0) + 1);

        cart.setItems(cartItems);
        return convertToResponse(cartRepository.save(cart));
    }

    /**
     * Lấy dữ liệu giỏ hàng từ DB.
     * Giúp giỏ hàng tồn tại sau khi đăng xuất/đăng nhập lại.
     */
    @Override
    public CartResponse getCart() {
        String loggedInUserId = userService.findByUserId();
        CartEntity entity = cartRepository.findByUserId(loggedInUserId)
                .orElse(CartEntity.builder()
                        .userId(loggedInUserId)
                        .items(new HashMap<>())
                        .build());
        return convertToResponse(entity);
    }

    /**
     * Xóa sạch giỏ hàng người dùng.
     */
    @Override
    public void clearCart() {
        String loggedInUserId = userService.findByUserId();
        cartRepository.deleteByUserId(loggedInUserId);
    }

    /**
     * Giảm số lượng món ăn (-1).
     * Nếu số lượng chạm mốc 0, xóa hẳn món ăn khỏi MongoDB.
     */
    @Override
    public CartResponse removeFromCart(CartRequest cartRequest) {
        String loggedInUserId = userService.findByUserId();
        CartEntity entity = cartRepository.findByUserId(loggedInUserId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng"));

        Map<String, Integer> cartItems = entity.getItems();
        String foodId = cartRequest.getFoodId();

        if (cartItems.containsKey(foodId)) {
            int currentQty = cartItems.get(foodId);
            if (currentQty > 1) {
                cartItems.put(foodId, currentQty - 1);
            } else {
                // Xóa key hoàn toàn khỏi Map nếu số lượng về 0
                cartItems.remove(foodId);
            }
            entity.setItems(cartItems);
            entity = cartRepository.save(entity);
        }
        return convertToResponse(entity);
    }

    /**
     * ⭐ HÀM MỚI: Xóa vĩnh viễn món ăn bất kể số lượng.
     * Khớp với nút "Thùng rác" ở Frontend.
     */
    @Override
    public CartResponse deleteItemCompletely(CartRequest cartRequest) {
        String loggedInUserId = userService.findByUserId();
        CartEntity entity = cartRepository.findByUserId(loggedInUserId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng"));

        Map<String, Integer> cartItems = entity.getItems();
        String foodId = cartRequest.getFoodId();

        if (cartItems != null) {
            cartItems.remove(foodId); // Xóa Key khỏi MongoDB Map
            entity.setItems(cartItems);
            entity = cartRepository.save(entity);
        }

        return convertToResponse(entity);
    }

    private CartResponse convertToResponse(CartEntity cartEntity) {
        return CartResponse.builder()
                .id(cartEntity.getId())
                .userId(cartEntity.getUserId())
                .items(cartEntity.getItems() != null ? cartEntity.getItems() : new HashMap<>())
                .build();
    }
}