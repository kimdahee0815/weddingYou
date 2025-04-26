package com.mysite.weddingyou_backend.plannerProfile;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mysite.weddingyou_backend.userRegister.UserRegisterRepository;

@Service
@Transactional
public class PlannerProfileService {

    @Autowired
    private PlannerProfileRepository plannerprofileRepository;
    
    @Autowired
    private UserRegisterRepository userRepository;

    public PlannerProfile getPlannerByEmail(String email) {
        return plannerprofileRepository.findByPlannerEmail(email);
    }
    
    public List<PlannerProfile> getPlannerProfiles(){
    	return plannerprofileRepository.findAll();
    }
    
    public void save(PlannerProfile plannerProfile) {
    	plannerprofileRepository.save(plannerProfile);
    	
    }

   
}


