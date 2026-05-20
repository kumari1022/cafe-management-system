package com.inn.cafe.serviceImpl;

import com.google.common.base.Strings;
import com.inn.cafe.JWT.CustomerUserDetailsService;
import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.JWT.jwtUtil;
import com.inn.cafe.POJO.User;
import com.inn.cafe.constents.CafeConstants;
import com.inn.cafe.dao.UserDao;
import com.inn.cafe.service.UserService;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.utils.EmailUtil;
import com.inn.cafe.wrapper.UserWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserDao userDao;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    jwtUtil jwtUtil;

    @Autowired
    JwtFilter jwtFilter;

    @Autowired
    CustomerUserDetailsService customerUserDetailsService;

    @Autowired
    EmailUtil emailUtil;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public ResponseEntity<String> signup(Map<String, String> requestMap) {
        log.info("Inside signup {}", requestMap);
        try {
            if (validateSignUpMap(requestMap)) {
                User user = userDao.findByEmailId(requestMap.get("email"));
                if (Objects.isNull(user)) {
                    User newUser = new User();
                    newUser.setName(requestMap.get("name"));
                    newUser.setEmail(requestMap.get("email"));
                    newUser.setContactNumber(requestMap.get("contactNumber"));
                    newUser.setPassword(passwordEncoder.encode(requestMap.get("password")));
                    newUser.setRole("user");
                    newUser.setStatus("true");
                    userDao.save(newUser);
                    return CafeUtils.getResponeEntity("Successfully Registered.", HttpStatus.OK);
                } else {
                    return CafeUtils.getResponeEntity("Email already exists.", HttpStatus.BAD_REQUEST);
                }
            } else {
                return CafeUtils.getResponeEntity(CafeConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private boolean validateSignUpMap(Map<String, String> requestMap) {
        return requestMap.containsKey("name") && requestMap.containsKey("contactNumber")
                && requestMap.containsKey("email") && requestMap.containsKey("password");
    }

    @Override
    public ResponseEntity<String> login(Map<String, String> requestMap) {
        log.info("Inside login {}", requestMap);
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(requestMap.get("email"), requestMap.get("password")));
            if (auth.isAuthenticated()) {
                User user = customerUserDetailsService.getUserDatails();
                String status = user.getStatus() == null ? "" : user.getStatus().toLowerCase();
                if (status.equals("true") || status.equals("active")) {
                    String role = user.getRole() == null ? "staff" : user.getRole().toLowerCase();
                    String token = jwtUtil.generateToken(user.getEmail(), role);
                    return new ResponseEntity<>(
                            "{\"token\":\"" + token + "\",\"role\":\"" + role + "\"}",
                            HttpStatus.OK);
                }
                return new ResponseEntity<>("{\"message\":\"Account is inactive. Contact admin.\"}", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception ex) {
            log.error("Login failed", ex);
        }
        return new ResponseEntity<>("{\"message\":\"Bad Credentials.\"}", HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<List<UserWrapper>> getAllStaff() {
        try {
            if (jwtFilter.isAdmin()) {
                return new ResponseEntity<>(userDao.getAllStaff(), HttpStatus.OK);
            }
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.UNAUTHORIZED);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> addStaff(Map<String, String> requestMap) {
        try {
            if (!jwtFilter.isAdmin()) {
                return CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
            if (!validateStaffMap(requestMap, false)) {
                return CafeUtils.getResponeEntity(CafeConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }
            if (userDao.findByEmailId(requestMap.get("email")) != null) {
                return CafeUtils.getResponeEntity("Email already exists.", HttpStatus.BAD_REQUEST);
            }
            User staff = new User();
            staff.setName(requestMap.get("name"));
            staff.setEmail(requestMap.get("email"));
            staff.setContactNumber(requestMap.get("contactNumber"));
            staff.setPassword(passwordEncoder.encode(requestMap.get("password")));
            staff.setRole("staff");
            staff.setStatus("active");
            userDao.save(staff);
            return CafeUtils.getResponeEntity("Staff added successfully.", HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateStaff(Map<String, String> requestMap) {
        try {
            if (!jwtFilter.isAdmin()) {
                return CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
            if (!requestMap.containsKey("id")) {
                return CafeUtils.getResponeEntity(CafeConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }
            Optional<User> optional = userDao.findById(Integer.parseInt(requestMap.get("id")));
            if (optional.isEmpty() || !"staff".equalsIgnoreCase(optional.get().getRole())) {
                return CafeUtils.getResponeEntity("Staff not found.", HttpStatus.BAD_REQUEST);
            }
            User staff = optional.get();
            if (requestMap.containsKey("name")) {
                staff.setName(requestMap.get("name"));
            }
            if (requestMap.containsKey("contactNumber")) {
                staff.setContactNumber(requestMap.get("contactNumber"));
            }
            if (requestMap.containsKey("status")) {
                staff.setStatus(requestMap.get("status"));
            }
            if (requestMap.containsKey("password") && !Strings.isNullOrEmpty(requestMap.get("password"))) {
                staff.setPassword(passwordEncoder.encode(requestMap.get("password")));
            }
            userDao.save(staff);
            return CafeUtils.getResponeEntity("Staff updated successfully.", HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteStaff(Integer id) {
        try {
            if (!jwtFilter.isAdmin()) {
                return CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
            Optional<User> optional = userDao.findById(id);
            if (optional.isEmpty() || !"staff".equalsIgnoreCase(optional.get().getRole())) {
                return CafeUtils.getResponeEntity("Staff not found.", HttpStatus.BAD_REQUEST);
            }
            userDao.deleteById(id);
            return CafeUtils.getResponeEntity("Staff deleted successfully.", HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> checkToken() {
        return CafeUtils.getResponeEntity("true", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> changePassword(Map<String, String> requestMap) {
        try {
            String email = jwtFilter.getCurrentUsername();
            if (email == null) {
                return CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
            User user = userDao.findByEmail(email);
            if (user == null) {
                return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (!passwordEncoder.matches(requestMap.get("oldPassword"), user.getPassword())) {
                return CafeUtils.getResponeEntity("Incorrect old password.", HttpStatus.BAD_REQUEST);
            }
            user.setPassword(passwordEncoder.encode(requestMap.get("newPassword")));
            userDao.save(user);
            return CafeUtils.getResponeEntity("Password updated successfully.", HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> forgetPassword(Map<String, String> requestMap) {
        try {
            User user = userDao.findByEmail(requestMap.get("email"));
            if (!Objects.isNull(user) && !Strings.isNullOrEmpty(user.getEmail())) {
                emailUtil.forgetMail(user.getEmail(), "Password reset", "Contact admin to reset your password.");
                return CafeUtils.getResponeEntity("Check your email for instructions.", HttpStatus.OK);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private boolean validateStaffMap(Map<String, String> requestMap, boolean isUpdate) {
        if (!isUpdate) {
            return requestMap.containsKey("name")
                    && requestMap.containsKey("email")
                    && requestMap.containsKey("contactNumber")
                    && requestMap.containsKey("password");
        }
        return requestMap.containsKey("id");
    }
}
