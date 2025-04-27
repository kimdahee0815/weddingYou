package com.mysite.weddingyou_backend.plannerProfile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PlannerProfileRepository extends JpaRepository<PlannerProfile, Long> {
    
    @Query("SELECT DISTINCT p FROM PlannerProfile p " +
       "LEFT JOIN FETCH p.reviews r " +
       "WHERE p.plannerEmail = :email")
    PlannerProfile findByPlannerEmailFetchJoin(String email);
    
    void deleteByPlannerEmail(String email);
 
}
