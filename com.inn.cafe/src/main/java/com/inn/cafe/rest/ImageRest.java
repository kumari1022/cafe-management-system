package com.inn.cafe.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@RequestMapping(path = "/product")
public interface ImageRest {
    
    @PostMapping(path = "/uploadImage")
    ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file);
}
