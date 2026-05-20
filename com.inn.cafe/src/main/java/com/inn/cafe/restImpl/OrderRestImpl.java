package com.inn.cafe.restImpl;

import com.inn.cafe.constents.CafeConstants;
import com.inn.cafe.rest.OrderRest;
import com.inn.cafe.service.OrderService;
import com.inn.cafe.utils.CafeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class OrderRestImpl implements OrderRest {

    @Autowired
    OrderService orderService;

    @Override
    public ResponseEntity<String> placeOrder(Map<String, Object> requestMap) {
        try {
            return orderService.placeOrder(requestMap);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Map<String, Object>>> getUserOrders() {
        try {
            return orderService.getUserOrders();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Map<String, Object>>> getAllOrders() {
        try {
            return orderService.getAllOrders();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateOrderStatus(Map<String, String> requestMap) {
        try {
            return orderService.updateOrderStatus(requestMap);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
