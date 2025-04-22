package com.mysite.weddingyou_backend.userRegister;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRegisterRepository extends JpaRepository<UserRegister, Long> {
    UserRegister findByEmail(String email);
}
