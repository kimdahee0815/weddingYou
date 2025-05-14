package com.mysite.weddingyou_backend.plannerUpdateDelete;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mysite.weddingyou_backend.like.LikeEntity;
import com.mysite.weddingyou_backend.like.LikeRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;


@Service
@Transactional
public class PlannerUpdateDeleteService {
	 
	@Autowired
	private PlannerUpdateDeleteRepository plannerRepository;

	@Autowired
	private LikeRepository likeRepository;
	
	public PlannerUpdateDelete getPlannerByEmail(String email) {
		//System.out.println(plannerRepository.findByEmail(email));
        return plannerRepository.findByEmail(email);
    }
	
	public void save(PlannerUpdateDelete planner) {
		//repository의 save 메소드 소환
		plannerRepository.save(planner);
		// repository의 save 메서드 호출(조건. entity 객체를 넘겨줘야 함)
	}
	
	public void delete(PlannerUpdateDelete planner) { 
    if (planner != null) {
        List<LikeEntity> likes = likeRepository.findByPlannerEmail(planner.getEmail());
        likeRepository.deleteAll(likes);
        
        plannerRepository.delete(planner);
    } else {
        throw new EntityNotFoundException("Planner with email not found.");
    }
	}
	

}
