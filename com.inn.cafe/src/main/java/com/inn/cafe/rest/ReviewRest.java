package com.inn.cafe.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping(path = "/review")
public interface ReviewRest {

    @PostMapping(path = "/add")
    ResponseEntity<String> addReview(@RequestBody Map<String, String> requestMap);

    @GetMapping(path = "/getByProduct/{productId}")
    ResponseEntity<List<Map<String, Object>>> getReviewsByProduct(@PathVariable Integer productId);

    @GetMapping(path = "/getAll")
    ResponseEntity<List<Map<String, Object>>> getAllReviews();

    @PostMapping(path = "/delete/{id}")
    ResponseEntity<String> deleteReview(@PathVariable Integer id);
}
