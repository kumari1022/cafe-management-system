package com.inn.cafe.serviceImpl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.POJO.OrderItem;
import com.inn.cafe.POJO.Orders;
import com.inn.cafe.POJO.Product;
import com.inn.cafe.POJO.User;
import com.inn.cafe.constents.CafeConstants;
import com.inn.cafe.dao.OrderDao;
import com.inn.cafe.dao.OrderItemDao;
import com.inn.cafe.dao.UserDao;
import com.inn.cafe.service.OrderService;
import com.inn.cafe.utils.CafeUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    OrderDao orderDao;

    @Autowired
    OrderItemDao orderItemDao;

    @Autowired
    UserDao userDao;

    @Autowired
    JwtFilter jwtFilter;

    @Override
    public ResponseEntity<String> placeOrder(Map<String, Object> requestMap) {
        log.info("Inside placeOrder {}", requestMap);
        try {
            if (requestMap.containsKey("totalAmount") && requestMap.containsKey("items")) {
                String currentUserEmail = jwtFilter.getCurrentUsername();
                User user = userDao.findByEmailId(currentUserEmail);
                if (user == null) {
                    return CafeUtils.getResponeEntity("User not found.", HttpStatus.BAD_REQUEST);
                }

                Orders order = new Orders();
                order.setUser(user);
                order.setTotalAmount((Integer) requestMap.get("totalAmount"));
                order.setOrderStatus("Pending");
                orderDao.save(order);

                ObjectMapper mapper = new ObjectMapper();
                List<Map<String, Object>> items = mapper.convertValue(requestMap.get("items"), new TypeReference<List<Map<String, Object>>>() {});

                for (Map<String, Object> itemMap : items) {
                    OrderItem item = new OrderItem();
                    item.setOrder(order);
                    Product product = new Product();
                    product.setId((Integer) itemMap.get("productId"));
                    item.setProduct(product);
                    item.setQuantity((Integer) itemMap.get("quantity"));
                    item.setPrice((Integer) itemMap.get("price"));
                    orderItemDao.save(item);
                }
                return CafeUtils.getResponeEntity("Order placed successfully.", HttpStatus.OK);
            }
            return CafeUtils.getResponeEntity(CafeConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Map<String, Object>>> getUserOrders() {
        try {
            String currentUserEmail = jwtFilter.getCurrentUsername();
            User user = userDao.findByEmailId(currentUserEmail);
            if (user == null) {
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
            }
            List<Orders> orders = orderDao.getOrdersByUser(user.getId());
            return new ResponseEntity<>(buildOrderResponse(orders), HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Map<String, Object>>> getAllOrders() {
        try {
            if (jwtFilter.isAdmin() || jwtFilter.isStaff()) {
                List<Orders> orders = orderDao.getAllOrders();
                return new ResponseEntity<>(buildOrderResponse(orders), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateOrderStatus(Map<String, String> requestMap) {
        try {
            if (jwtFilter.isAdmin() || jwtFilter.isStaff()) {
                if (requestMap.containsKey("id") && requestMap.containsKey("status")) {
                    Optional<Orders> optionalOrder = orderDao.findById(Integer.parseInt(requestMap.get("id")));
                    if (!optionalOrder.isEmpty()) {
                        Orders order = optionalOrder.get();
                        order.setOrderStatus(requestMap.get("status"));
                        orderDao.save(order);
                        return CafeUtils.getResponeEntity("Order status updated successfully.", HttpStatus.OK);
                    }
                    return CafeUtils.getResponeEntity("Order id does not exist.", HttpStatus.OK);
                }
                return CafeUtils.getResponeEntity(CafeConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            } else {
                return CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private List<Map<String, Object>> buildOrderResponse(List<Orders> orders) {
        List<Map<String, Object>> response = new ArrayList<>();
        for (Orders order : orders) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", order.getId());
            map.put("totalAmount", order.getTotalAmount());
            map.put("orderStatus", order.getOrderStatus());
            map.put("createdAt", order.getCreatedAt());
            map.put("userName", order.getUser().getName());
            map.put("userEmail", order.getUser().getEmail());

            List<OrderItem> items = orderItemDao.getItemsByOrder(order.getId());
            List<Map<String, Object>> itemsMap = new ArrayList<>();
            for (OrderItem item : items) {
                Map<String, Object> iMap = new HashMap<>();
                iMap.put("id", item.getId());
                iMap.put("productId", item.getProduct().getId());
                iMap.put("productName", item.getProduct().getName());
                iMap.put("quantity", item.getQuantity());
                iMap.put("price", item.getPrice());
                itemsMap.add(iMap);
            }
            map.put("items", itemsMap);
            response.add(map);
        }
        return response;
    }
}
