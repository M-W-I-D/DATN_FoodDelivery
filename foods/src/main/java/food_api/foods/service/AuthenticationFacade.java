package food_api.foods.service;

import org.springframework.security.core.Authentication; // SỬA TẠI ĐÂY


public interface AuthenticationFacade {
    Authentication getAuthentication();
}
