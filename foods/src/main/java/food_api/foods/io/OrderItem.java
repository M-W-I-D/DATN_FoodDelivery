package food_api.foods.io;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class OrderItem {
    private String foodId;
    private int quantity;
    private double price;
    private String category;
    private String imageUrl;
    private String description;
    private String name;
}
