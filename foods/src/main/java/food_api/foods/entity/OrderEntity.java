package food_api.foods.entity;

import food_api.foods.io.OrderItem;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@Document(collection = "orders")
public class OrderEntity {

    @Id
    private String id;

    private String userId;
    private String userAddress;
    private String phoneNumber;
    private String email;

    private List<OrderItem> orderedItems;
    private double amount;

    // PAYMENT
    private String paymentStatus;     // PENDING | PAID | FAILED
    private String payosOrderId;       // orderCode / orderId từ PayOS
    private String payosTransactionId; // transactionId PayOS trả về
    private String payosSignature;     // checksum/signature PayOS
    private String payosPaymentId;
    // ORDER
    private String orderStatus;        // CREATED | CONFIRMED | CANCELLED
}
