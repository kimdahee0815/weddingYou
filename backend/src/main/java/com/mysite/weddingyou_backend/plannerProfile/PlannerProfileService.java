package com.mysite.weddingyou_backend.plannerProfile;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PlannerProfileService {

    @Autowired
    private PlannerProfileRepository plannerprofileRepository;

    public PlannerProfileDTO getPlannerByEmail(String email) {
        PlannerProfile foundProfile = plannerprofileRepository.findByPlannerEmailFetchJoin(email);
        if(foundProfile != null){
            return PlannerProfileDTO.fromEntity(foundProfile); 
        }else{
            return null;
        }
       
    }
    
    public List<PlannerProfile> getPlannerProfiles(){
    	return plannerprofileRepository.findAll();
    }
    
    public void save(PlannerProfileDTO newProfileDTO) {
        PlannerProfile newProfile = newProfileDTO.toEntity();   
        plannerprofileRepository.save(newProfile);   	
    }

}


