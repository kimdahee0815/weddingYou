package com.mysite.weddingyou_backend.plannerProfile;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mysite.weddingyou_backend.item.ItemDTO;
import com.mysite.weddingyou_backend.review.ReviewDTO;
import com.mysite.weddingyou_backend.userRegister.UserRegisterRepository;

@Service
@Transactional
public class PlannerProfileService {

    @Autowired
    private PlannerProfileRepository plannerprofileRepository;
    
    @Autowired
    private UserRegisterRepository userRepository;

    public PlannerProfileDTO getPlannerByEmail(String email) {
        PlannerProfile foundProfile = plannerprofileRepository.findByPlannerEmailFetchJoin(email);
        return PlannerProfileDTO.fromEntity(foundProfile); 
    }
    
    public List<PlannerProfile> getPlannerProfiles(){
    	return plannerprofileRepository.findAll();
    }
    
    public void save(PlannerProfileDTO newProfileDTO) {
        PlannerProfile newProfile = newProfileDTO.toEntity();   
        plannerprofileRepository.save(newProfile);   	
    }

}


