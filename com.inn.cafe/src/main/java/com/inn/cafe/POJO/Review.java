package com.inn.cafe.POJO;

import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@NamedQuery(name = "Review.getAllReviews", query = "select r from Review r order by r.id desc")
@NamedQuery(name = "Review.getReviewsByProduct", query = "select r from Review r where r.product.id=:productId order by r.id desc")

@Data
@Entity
@DynamicUpdate
@DynamicInsert
@Table(name = "review")
public class Review implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_fk", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_fk", nullable = false)
    private Product product;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "comment", length = 1000)
    private String comment;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date();

}
