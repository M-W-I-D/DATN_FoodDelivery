    package food_api.foods.controller;

    import food_api.foods.io.CartRequest;
    import food_api.foods.io.CartResponse;
    import food_api.foods.service.CartService;
    import lombok.AllArgsConstructor;
    import org.springframework.http.HttpStatus;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.server.ResponseStatusException;

    @RestController
    @RequestMapping("/api/cart")
    @AllArgsConstructor
    public class CartController {

        private final CartService cartService;

        /**
         * Thêm món ăn hoặc tăng số lượng (+1)
         */
        @PostMapping("/add")
        public CartResponse addToCart(@RequestBody CartRequest request) {
            validateRequest(request);
            return cartService.addToCart(request);
        }

        /**
         * Lấy dữ liệu giỏ hàng hiện tại của người dùng
         */
        @PostMapping("/get")
        public CartResponse getCart(){
            return cartService.getCart();
        }

        /**
         * Giảm số lượng món ăn (-1).
         * Nếu số lượng về 0, logic trong Service sẽ tự xóa khỏi DB.
         */
        @PostMapping("/remove")
        public CartResponse removeFromCart(@RequestBody CartRequest request) {
            validateRequest(request);
            return cartService.removeFromCart(request);
        }

        /**
         * ⭐ ENDPOINT MỚI: Xóa vĩnh viễn món ăn khỏi giỏ hàng
         * Khớp với hàm axios.post("${url}/api/cart/delete-item", ...) ở Frontend
         */
        @PostMapping("/delete-item")
        public CartResponse deleteItemCompletely(@RequestBody CartRequest request) {
            validateRequest(request);
            return cartService.deleteItemCompletely(request);
        }

        /**
         * Xóa sạch toàn bộ giỏ hàng (Clear all)
         */
        @DeleteMapping("/clear")
        @ResponseStatus(HttpStatus.NO_CONTENT)
        public void clearCart(){
            cartService.clearCart();
        }

        /**
         * Hàm dùng chung để kiểm tra dữ liệu đầu vào
         */
        private void validateRequest(CartRequest request) {
            if (request == null || request.getFoodId() == null || request.getFoodId().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã món ăn (foodId) không được để trống");
            }
        }
    }