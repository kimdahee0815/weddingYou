package com.mysite.weddingyou_backend.plannerProfile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mysite.weddingyou_backend.estimate.Estimate;
import com.mysite.weddingyou_backend.estimate.EstimateRepository;
import com.mysite.weddingyou_backend.plannerProfile.PlannerProfileController.ReviewStats;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDelete;
import com.mysite.weddingyou_backend.review.Review;
import com.mysite.weddingyou_backend.review.ReviewDTO;
import com.mysite.weddingyou_backend.review.ReviewRepository;

@Service
public class PlannerProfileUtils {
	private final PlannerProfileService plannerProfileService;
    private final ReviewRepository reviewRepository;
    private final EstimateRepository estimateRepository;

    @Autowired
    public PlannerProfileUtils(
        PlannerProfileService plannerProfileService,
        ReviewRepository reviewRepository,
        EstimateRepository estimateRepository
    ) {
        this.plannerProfileService = plannerProfileService;
        this.reviewRepository = reviewRepository;
        this.estimateRepository = estimateRepository;
    }
    // planner profile create or update
	 public PlannerProfileDTO createOrUpdatePlannerProfile(PlannerUpdateDelete plannerInfo) throws ParseException {

        PlannerProfileDTO existingProfile = plannerProfileService.getPlannerByEmail(plannerInfo.getEmail());
        PlannerProfileDTO profile = (existingProfile != null) ? existingProfile : new PlannerProfileDTO();

        String plannerEmail = plannerInfo.getEmail();
        List<Review> reviews = reviewRepository.findAllByPlannerEmailFetchUserAndComments(plannerEmail);
        List<Estimate> estimates = estimateRepository.findAll();

        ReviewStats reviewStats = calculateReviewStats(reviews);
        int matchingCount = calculateMatchingCount(estimates, plannerEmail);

        profile.setPlannerEmail(plannerEmail);
        profile.setPlannerName(plannerInfo.getName());
        profile.setIntroduction(plannerInfo.getIntroduction());
        profile.setPhoneNum(plannerInfo.getPhoneNum());
        profile.setPlannerProfileImg(plannerInfo.getPlannerImg());
        profile.setPlannerJoinDate(plannerInfo.getPlannerJoinDate());
        profile.setCareer(plannerInfo.getPlannerCareerYears());
        profile.setReviewCount(reviewStats.getReviewCount());
        profile.setReviewStars(reviewStats.getReviewStars());
        profile.setReviewUsers(reviewStats.getReviewUsers());
        profile.setMatchingCount(matchingCount);
        profile.setAvgReviewStars(reviewStats.getAvgReviewStars());

        List<ReviewDTO> reviewsDTOs = reviews.stream().map(ReviewDTO::fromEntity).collect(Collectors.toList());
        profile.setReviews(reviewsDTOs);

        return profile;
    }

    	// calcualte reviews
	public static ReviewStats calculateReviewStats(List<Review> reviews) {
    int totalReviewStars = 0;
    int reviewCount = 0;
    ArrayList<String> reviewUsers = new ArrayList<>();
    ArrayList<Integer> reviewStars = new ArrayList<>();

    if (reviews != null) {
        for (Review review : reviews) {
            reviewUsers.add(review.getUserEmail());
            reviewStars.add(review.getReviewStars());
            totalReviewStars += review.getReviewStars();
        }
        reviewCount = reviews.size();
    }

    double avgReviewStars = reviewCount > 0 ? Math.round(totalReviewStars / (double) reviewCount * 100.0) / 100.0 : 0.0;
    String avgReviewStarsStr = String.valueOf(avgReviewStars);

    return new ReviewStats(reviewCount, reviewStars.toString(), reviewUsers.toString(), avgReviewStarsStr);
	}

	// matching count
	public static int calculateMatchingCount(List<Estimate> estimates, String plannerEmail) throws ParseException {
    int matchingCount = 0;
    for (Estimate estimate : estimates) {
        if (estimate.isMatchstatus()) {
            JSONParser parser = new JSONParser();
            ArrayList<String> matchedPlanners = (ArrayList<String>) parser.parse(estimate.getPlannermatching());
            if (matchedPlanners.contains(plannerEmail)) {
                matchingCount++;
            }
        }
    }
    return matchingCount;
	}
}