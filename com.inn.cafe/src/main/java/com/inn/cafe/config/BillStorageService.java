package com.inn.cafe.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class BillStorageService {

    @Value("${cafe.bills.storage-path:}")
    private String configuredPath;

    private Path billsDirectory;

    @PostConstruct
    public void init() throws IOException {
        if (configuredPath != null && !configuredPath.isBlank()) {
            billsDirectory = Paths.get(configuredPath);
        } else {
            billsDirectory = Paths.get(System.getProperty("user.dir"), "bills");
        }
        Files.createDirectories(billsDirectory);
    }

    public Path getBillsDirectory() {
        return billsDirectory;
    }

    public Path resolvePdfPath(String uuid) {
        return billsDirectory.resolve(uuid + ".pdf");
    }
}
