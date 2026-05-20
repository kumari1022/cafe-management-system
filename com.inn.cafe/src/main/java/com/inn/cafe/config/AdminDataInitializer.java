package com.inn.cafe.config;

import com.inn.cafe.POJO.User;
import com.inn.cafe.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates default ADMIN on first startup if that email does not exist yet.
 */
@Component
public class AdminDataInitializer implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "kumarinagadurgak@gmail.com";
    private static final String ADMIN_PASSWORD = "kumari";

    @Autowired
    private UserDao userDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        User existing = userDao.findByEmailId(ADMIN_EMAIL);
        if (existing == null) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail(ADMIN_EMAIL);
            admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
            admin.setRole("admin");
            admin.setStatus("active");
            admin.setContactNumber("0000000000");
            userDao.save(admin);

        } else if (existing.getPassword() != null && !existing.getPassword().startsWith("$2")) {
            existing.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
            existing.setRole("admin");
            existing.setStatus("active");
            userDao.save(existing);

        }
    }
}
