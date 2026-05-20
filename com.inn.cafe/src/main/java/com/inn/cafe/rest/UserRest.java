package com.inn.cafe.rest;

import com.inn.cafe.wrapper.UserWrapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping(path = "/user")
public interface UserRest {

    @PostMapping(path = "/signup")
    ResponseEntity<String> signup(@RequestBody Map<String, String> requestMap);

    @PostMapping(path = "/login")
    ResponseEntity<String> login(@RequestBody Map<String, String> requestMap);

    @GetMapping(path = "/checkToken")
    ResponseEntity<String> checkToken();

    @PostMapping(path = "/changePassword")
    ResponseEntity<String> changePassword(@RequestBody Map<String, String> requestMap);

    @PostMapping(path = "/forgotPassword")
    ResponseEntity<String> forgetPassword(@RequestBody Map<String, String> requestMap);

    @GetMapping(path = "/staff/getAll")
    ResponseEntity<List<UserWrapper>> getAllStaff();

    @PostMapping(path = "/staff/add")
    ResponseEntity<String> addStaff(@RequestBody Map<String, String> requestMap);

    @PostMapping(path = "/staff/update")
    ResponseEntity<String> updateStaff(@RequestBody Map<String, String> requestMap);

    @PostMapping(path = "/staff/delete/{id}")
    ResponseEntity<String> deleteStaff(@PathVariable Integer id);
}
