package com.inn.cafe.dao;

import com.inn.cafe.POJO.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewDao extends JpaRepository<Review, Integer> {
    List<Review> getAllReviews();
    List<Review> getReviewsByProduct(@Param("productId") Integer productId);
}
