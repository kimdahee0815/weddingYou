package com.mysite.weddingyou_backend.review;

import java.util.List;

import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mysite.weddingyou_backend.estimate.EstimateRepository;
import com.mysite.weddingyou_backend.plannerProfile.PlannerProfileDTO;
import com.mysite.weddingyou_backend.plannerProfile.PlannerProfileService;
import com.mysite.weddingyou_backend.plannerProfile.PlannerProfileUtils;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDelete;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDeleteRepository;


@Service
@Transactional
public class ReviewService {
	
	@Autowired
	ReviewRepository reviewRepository;

	@Autowired
	PlannerUpdateDeleteRepository plannerUpdateDeleteRepository;

	@Autowired
	PlannerProfileService plannerProfileService;

	@Autowired
	EstimateRepository estimateRepository;

	@Autowired
	private PlannerProfileUtils plannerProfileUtils;
	
	public void save(Review review) throws ParseException {
		reviewRepository.save(review);
		PlannerUpdateDelete plannerInfo = plannerUpdateDeleteRepository.findByEmail(review.getPlannerEmail());
    PlannerProfileDTO profile = plannerProfileUtils.createOrUpdatePlannerProfile(plannerInfo);
    plannerProfileService.save(profile);
	}

	public Review findEstimate(Long estimateId) {
		return reviewRepository.findByEstimateId(estimateId);
	}
	
	public List<Review> getReviewList(){
		return reviewRepository.findAll();
	}
}