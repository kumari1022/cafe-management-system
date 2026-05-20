package com.inn.cafe.service;

import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface OrderService {
    ResponseEntity<String> placeOrder(Map<String, Object> requestMap);

    ResponseEntity<List<Map<String, Object>>> getUserOrders();

    ResponseEntity<List<Map<String, Object>>> getAllOrders();

    ResponseEntity<String> updateOrderStatus(Map<String, String> requestMap);
}
