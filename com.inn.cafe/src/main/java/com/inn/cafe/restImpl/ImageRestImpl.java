package com.inn.cafe.restImpl;

import com.inn.cafe.rest.ImageRest;
import com.inn.cafe.utils.CafeUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@Slf4j
public class ImageRestImpl implements ImageRest {

    private final String UPLOAD_DIR = "backend/uploads/products/";

    @Override
    public ResponseEntity<String> uploadImage(MultipartFile file) {
        log.info("Inside uploadImage");
        try {
            if (file.isEmpty()) {
                return CafeUtils.getResponeEntity("File is empty", HttpStatus.BAD_REQUEST);
            }

            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String filename = UUID.randomUUID().toString() + extension;
            Path path = Paths.get(UPLOAD_DIR + filename);
            Files.write(path, file.getBytes());

            String imageUrl = "/uploads/products/" + filename;
            return new ResponseEntity<>("{\"imageUrl\":\"" + imageUrl + "\"}", HttpStatus.OK);

        } catch (IOException e) {
            log.error("Error uploading file", e);
            return CafeUtils.getResponeEntity("Failed to upload image", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
