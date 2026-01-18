package food_api.foods.service;

import food_api.foods.entity.OrderEntity;
import food_api.foods.io.OrderRequest;
import food_api.foods.io.OrderResponse;
import food_api.foods.repository.CartRepository;
import food_api.foods.repository.OrderRepository;
import food_api.foods.util.PayOSChecksumUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final CartRepository cartRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${payos.client.id}")
    private String clientId;

    @Value("${payos.api.key}")
    private String apiKey;

    @Value("${payos.checksum.key}")
    private String checksumKey;

    @Value("${payos.return.url}")
    private String returnUrl;

    @Value("${payos.cancel.url}")
    private String cancelUrl;

    private static final String PAYOS_CREATE_URL = "https://api-merchant.payos.vn/v2/payment-requests";

    @Override
    public OrderResponse createOrderWithPayment(OrderRequest request) {
        // 1. Lưu đơn hàng vào MongoDB
        OrderEntity order = OrderEntity.builder()
                .userId(userService.findByUserId())
                .userAddress(request.getUserAddress())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .orderedItems(request.getOrderedItems())
                .amount(request.getAmount())
                .paymentStatus("CHƯA_THANH_TOÁN")
                .orderStatus("ĐÃ_TẠO")
                .build();
        order = orderRepository.save(order);

        // 2. Tạo mã đơn hàng số (PayOS yêu cầu số nguyên Long)
        long orderCode = Long.parseLong(String.valueOf(System.currentTimeMillis()).substring(3));

        // --- LOGIC GIỚI HẠN KÝ TỰ MÔ TẢ (TỐI ĐA 25) ---
        String rawDescription = "Thanh toan don hang " + orderCode;
        String finalDescription = rawDescription;
        if (finalDescription.length() > 25) {
            finalDescription = finalDescription.substring(0, 25);
        }
        // ----------------------------------------------

        // 3. TẠO CHỮ KÝ (Bắt buộc Alphabet tự: amount, cancelUrl, description, orderCode, returnUrl)
        int amountInt = (int) order.getAmount();
        String dataToSign = "amount=" + amountInt +
                "&cancelUrl=" + cancelUrl +
                "&description=" + finalDescription +
                "&orderCode=" + orderCode +
                "&returnUrl=" + returnUrl;

        String signature = PayOSChecksumUtil.hmacSha256(dataToSign, checksumKey);

        // 4. Tạo Body gửi PayOS
        Map<String, Object> body = new HashMap<>();
        body.put("orderCode", orderCode);
        body.put("amount", amountInt);
        body.put("description", finalDescription);
        body.put("returnUrl", returnUrl);
        body.put("cancelUrl", cancelUrl);
        body.put("signature", signature);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-client-id", clientId);
            headers.set("x-api-key", apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(PAYOS_CREATE_URL, entity, Map.class);
            Map<String, Object> resBody = response.getBody();

            if (resBody != null && "00".equals(resBody.get("code"))) {
                Map<String, Object> data = (Map<String, Object>) resBody.get("data");
                String checkoutUrl = (String) data.get("checkoutUrl");

                order.setPayosOrderId(String.valueOf(orderCode));
                orderRepository.save(order);

                OrderResponse res = toResponse(order);
                res.setPaymentUrl(checkoutUrl);
                return res;
            } else {
                String errorMsg = resBody != null ? (String) resBody.get("desc") : "Unknown error";
                throw new RuntimeException("PayOS từ chối: " + errorMsg);
            }

        } catch (HttpClientErrorException e) {
            String responseBody = e.getResponseBodyAsString();
            System.err.println("LỖI CHI TIẾT TỪ PAYOS: " + responseBody);
            throw new RuntimeException("Dữ liệu thanh toán không hợp lệ, vui lòng kiểm tra log.");
        } catch (Exception e) {
            throw new RuntimeException("Lỗi kết nối PayOS: " + e.getMessage());
        }
    }

    @Override
    public void verifyPayment(Map<String, String> paymentData) {
        String orderCode = String.valueOf(paymentData.get("orderCode"));
        OrderEntity order = orderRepository.findByPayosOrderId(orderCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + orderCode));

        order.setPaymentStatus("ĐÃ_THANH_TOÁN");
        order.setPayosTransactionId(paymentData.get("transactionId"));
        order.setPayosSignature(paymentData.get("signature"));
        orderRepository.save(order);

        cartRepository.deleteByUserId(order.getUserId());
    }

    @Override
    public List<OrderResponse> getUserOrders() {
        return orderRepository.findByUserId(userService.findByUserId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public void removeOrder(String orderId) {
        orderRepository.deleteById(orderId);
    }

    @Override
    public List<OrderResponse> getOrdersOfAllUsers() {
        return orderRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        order.setOrderStatus(status);
        orderRepository.save(order);
    }

    private OrderResponse toResponse(OrderEntity o) {
        return OrderResponse.builder()
                .id(o.getId())
                .userId(o.getUserId())
                .userAddress(o.getUserAddress())
                .amount(o.getAmount())
                .paymentStatus(o.getPaymentStatus())
                .payosOrderId(o.getPayosOrderId())
                .orderStatus(o.getOrderStatus())
                .orderedItems(o.getOrderedItems())
                .build();
    }
}