package com.inn.cafe.serviceImpl;

import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.POJO.Product;
import com.inn.cafe.POJO.Review;
import com.inn.cafe.POJO.User;
import com.inn.cafe.constents.CafeConstants;
import com.inn.cafe.dao.ReviewDao;
import com.inn.cafe.dao.UserDao;
import com.inn.cafe.service.ReviewService;
import com.inn.cafe.utils.CafeUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    ReviewDao reviewDao;

    @Autowired
    UserDao userDao;

    @Autowired
    JwtFilter jwtFilter;

    @Override
    public ResponseEntity<String> addReview(Map<String, String> requestMap) {
        log.info("Inside addReview {}", requestMap);
        try {
            if (requestMap.containsKey("productId") && requestMap.containsKey("rating") && requestMap.containsKey("comment")) {
                String currentUserEmail = jwtFilter.getCurrentUsername();
                User user = userDao.findByEmailId(currentUserEmail);
                if (user == null) {
                    return CafeUtils.getResponeEntity("User not found.", HttpStatus.BAD_REQUEST);
                }
                Review review = new Review();
                review.setUser(user);
                
                Product product = new Product();
                product.setId(Integer.parseInt(requestMap.get("productId")));
                review.setProduct(product);
                
                review.setRating(Integer.parseInt(requestMap.get("rating")));
                review.setComment(requestMap.get("comment"));
                reviewDao.save(review);
                return CafeUtils.getResponeEntity("Review added successfully.", HttpStatus.OK);
            }
            return CafeUtils.getResponeEntity(CafeConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Map<String, Object>>> getReviewsByProduct(Integer productId) {
        try {
            List<Review> reviews = reviewDao.getReviewsByProduct(productId);
            return new ResponseEntity<>(buildReviewResponse(reviews), HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Map<String, Object>>> getAllReviews() {
        try {
            if (jwtFilter.isAdmin()) {
                List<Review> reviews = reviewDao.getAllReviews();
                return new ResponseEntity<>(buildReviewResponse(reviews), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteReview(Integer id) {
        try {
            if (jwtFilter.isAdmin()) {
                Optional<Review> optionalReview = reviewDao.findById(id);
                if (!optionalReview.isEmpty()) {
                    reviewDao.deleteById(id);
                    return CafeUtils.getResponeEntity("Review deleted successfully.", HttpStatus.OK);
                }
                return CafeUtils.getResponeEntity("Review id does not exist.", HttpStatus.OK);
            } else {
                return CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private List<Map<String, Object>> buildReviewResponse(List<Review> reviews) {
        List<Map<String, Object>> response = new ArrayList<>();
        for (Review review : reviews) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", review.getId());
            map.put("userId", review.getUser().getId());
            map.put("userName", review.getUser().getName());
            map.put("productId", review.getProduct().getId());
            map.put("productName", review.getProduct().getName());
            map.put("rating", review.getRating());
            map.put("comment", review.getComment());
            map.put("createdAt", review.getCreatedAt());
            response.add(map);
        }
        return response;
    }
}
