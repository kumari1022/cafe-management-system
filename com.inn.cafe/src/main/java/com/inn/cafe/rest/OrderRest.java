package com.inn.cafe.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping(path = "/order")
public interface OrderRest {

    @PostMapping(path = "/placeOrder")
    ResponseEntity<String> placeOrder(@RequestBody Map<String, Object> requestMap);

    @GetMapping(path = "/getUserOrders")
    ResponseEntity<List<Map<String, Object>>> getUserOrders();

    @GetMapping(path = "/getAllOrders")
    ResponseEntity<List<Map<String, Object>>> getAllOrders();

    @PostMapping(path = "/updateOrderStatus")
    ResponseEntity<String> updateOrderStatus(@RequestBody Map<String, String> requestMap);
}
