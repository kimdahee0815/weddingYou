package com.mysite.weddingyou_backend.plannerProfile;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlannerProfileRepository extends JpaRepository<PlannerProfile, Long> {
    PlannerProfile findByPlannerEmail(String email);
    
    void deleteByPlannerEmail(String email);
 
}
