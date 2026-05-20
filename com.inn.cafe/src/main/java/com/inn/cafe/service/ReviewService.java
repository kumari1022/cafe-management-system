package com.inn.cafe.service;

import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface ReviewService {
    ResponseEntity<String> addReview(Map<String, String> requestMap);

    ResponseEntity<List<Map<String, Object>>> getReviewsByProduct(Integer productId);

    ResponseEntity<List<Map<String, Object>>> getAllReviews();

    ResponseEntity<String> deleteReview(Integer id);
}
