package com.mysite.weddingyou_backend.plannerRegister;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlannerRegisterRepository extends JpaRepository<PlannerRegister, Long> {
    PlannerRegister findByEmail(String email);
}
