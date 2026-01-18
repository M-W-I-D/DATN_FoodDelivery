package food_api.foods.io;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class OrderResponse {

    private String id;

    private String userId;
    private String userAddress;
    private double amount;

    // PAYOS
    private String paymentUrl;
    private String paymentStatus;
    private String payosOrderId;

    // ORDER
    private String orderStatus;

    private List<OrderItem> orderedItems;
}
