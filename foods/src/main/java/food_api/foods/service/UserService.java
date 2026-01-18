package food_api.foods.service;

import food_api.foods.io.UserRequest;
import food_api.foods.io.UserResponse;

public interface UserService {
    UserResponse registerUser(UserRequest request);

    String findByUserId();
}
