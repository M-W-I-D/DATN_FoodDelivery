package food_api.foods.service;

import food_api.foods.io.CartRequest;
import food_api.foods.io.CartResponse;

public interface CartService {
    CartResponse addToCart(CartRequest request);

    CartResponse getCart();

    void clearCart();

    CartResponse removeFromCart(CartRequest cartRequest);

    CartResponse deleteItemCompletely(CartRequest cartRequest);
}
