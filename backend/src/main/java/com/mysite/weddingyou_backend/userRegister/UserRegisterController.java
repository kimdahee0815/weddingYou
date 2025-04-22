package com.mysite.weddingyou_backend.userRegister;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserRegisterController {
    private final UserRegisterService userService;

    @Autowired
    public UserRegisterController(UserRegisterService userService) {
        this.userService = userService;
    }

    @PostMapping("/user/register")
    public ResponseEntity<UserRegister> createUser(@Valid @RequestBody UserRegisterDTO userDTO) {
        UserRegister createdUser = null;
		try {
			createdUser = userService.createUser(userDTO);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }
}
