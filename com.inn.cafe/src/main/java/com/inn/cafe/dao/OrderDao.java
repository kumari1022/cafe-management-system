package com.inn.cafe.dao;

import com.inn.cafe.POJO.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderDao extends JpaRepository<Orders, Integer> {
    List<Orders> getAllOrders();
    List<Orders> getOrdersByUser(@Param("userId") Integer userId);
}
