package com.inn.cafe.restImpl;

import com.inn.cafe.constents.CafeConstants;
import com.inn.cafe.rest.ReviewRest;
import com.inn.cafe.service.ReviewService;
import com.inn.cafe.utils.CafeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class ReviewRestImpl implements ReviewRest {

    @Autowired
    ReviewService reviewService;

    @Override
    public ResponseEntity<String> addReview(Map<String, String> requestMap) {
        try {
            return reviewService.addReview(requestMap);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Map<String, Object>>> getReviewsByProduct(Integer productId) {
        try {
            return reviewService.getReviewsByProduct(productId);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Map<String, Object>>> getAllReviews() {
        try {
            return reviewService.getAllReviews();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteReview(Integer id) {
        try {
            return reviewService.deleteReview(id);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
