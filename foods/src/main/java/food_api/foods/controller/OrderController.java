package food_api.foods.controller;

import food_api.foods.io.OrderRequest;
import food_api.foods.io.OrderResponse;
import food_api.foods.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@RequestBody OrderRequest request) {
        return orderService.createOrderWithPayment(request);
    }

    @PostMapping("/verify")
    public void verify(@RequestBody Map<String, String> paymentData) {
        orderService.verifyPayment(paymentData);
    }

    @GetMapping
    public List<OrderResponse> getUserOrders() {
        return orderService.getUserOrders();
    }


    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String orderId) {
        orderService.removeOrder(orderId);
    }

    //admin
    @GetMapping("/all")
    public List<OrderResponse> getAllOrders() {
        return orderService.getOrdersOfAllUsers();
    }

    //admin
    @PatchMapping("/status/{orderId}")
    public void updateOrderStatus(@PathVariable String orderId, @RequestParam String status){
        orderService.updateOrderStatus(orderId, status);
    }

}
