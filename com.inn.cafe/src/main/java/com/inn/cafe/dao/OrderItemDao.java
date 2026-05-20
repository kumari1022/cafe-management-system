package com.inn.cafe.dao;

import com.inn.cafe.POJO.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemDao extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> getItemsByOrder(@Param("orderId") Integer orderId);
}
