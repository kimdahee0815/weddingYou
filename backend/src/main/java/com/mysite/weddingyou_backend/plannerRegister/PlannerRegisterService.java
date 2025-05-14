package com.mysite.weddingyou_backend.plannerRegister;

import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mysite.weddingyou_backend.estimate.EstimateRepository;
import com.mysite.weddingyou_backend.plannerProfile.PlannerProfileDTO;
import com.mysite.weddingyou_backend.plannerProfile.PlannerProfileService;
import com.mysite.weddingyou_backend.plannerProfile.PlannerProfileUtils;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDelete;
import com.mysite.weddingyou_backend.review.ReviewRepository;
import com.mysite.weddingyou_backend.userRegister.UserRegisterRepository;

@Service
@Transactional
public class PlannerRegisterService {

    @Autowired
    private PlannerRegisterRepository plannerRepository;

    @Autowired
    private PlannerProfileUtils plannerProfileUtils; 
    
    @Autowired
    private UserRegisterRepository userRepository;

    @Autowired
    private PlannerProfileService plannerProfileService;


    public PlannerRegister getPlannerByEmail(String email) {
        return plannerRepository.findByEmail(email);
    }

    public PlannerRegister createPlanner(PlannerRegisterDTO plannerDTO) throws Exception {
    	if(userRepository.findByEmail(plannerDTO.getEmail())!=null) {
    		 throw new Exception("유저의 이메일과 중복됩니다.");
    	}
        PlannerRegister planner = new PlannerRegister();
        planner.setName(plannerDTO.getName());
        planner.setEmail(plannerDTO.getEmail());
        planner.setPassword(plannerDTO.getPassword());
        planner.setPhoneNum(plannerDTO.getPhoneNum());
//        planner.setPlannerImg(plannerDTO.getPlannerImg());
        planner.setGender(plannerDTO.getGender());
        planner.setCareer(plannerDTO.getCareer());
        planner.setPlannerJoinDate(LocalDateTime.now()); // 현재 시간으로 설정

        PlannerRegister savedPlanner = plannerRepository.save(planner);

        PlannerUpdateDelete plannerInfo = new PlannerUpdateDelete();
        plannerInfo.setEmail(plannerDTO.getEmail());
        plannerInfo.setName(plannerDTO.getName());
        plannerInfo.setPassword(plannerDTO.getPassword());
        plannerInfo.setPhoneNum(plannerDTO.getPhoneNum());
        plannerInfo.setGender(plannerDTO.getGender());
        plannerInfo.setPlannerCareerYears(String.valueOf(plannerDTO.getCareer()));
        plannerInfo.setPlannerJoinDate(planner.getPlannerJoinDate());
        PlannerProfileDTO profile = plannerProfileUtils.createOrUpdatePlannerProfile(plannerInfo);
        plannerProfileService.save(profile);
        return savedPlanner;
    }
}


