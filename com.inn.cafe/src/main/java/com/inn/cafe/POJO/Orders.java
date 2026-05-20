package com.inn.cafe.POJO;

import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@NamedQuery(name = "Orders.getAllOrders", query = "select o from Orders o order by o.id desc")
@NamedQuery(name = "Orders.getOrdersByUser", query = "select o from Orders o where o.user.id=:userId order by o.id desc")
@NamedQuery(name = "Orders.updateOrderStatus", query = "update Orders o set o.orderStatus=:orderStatus where o.id=:id")

@Data
@Entity
@DynamicUpdate
@DynamicInsert
@Table(name = "cafe_order")
public class Orders implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_fk", nullable = false)
    private User user;

    @Column(name = "total_amount")
    private Integer totalAmount;

    @Column(name = "order_status")
    private String orderStatus;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date();

}
