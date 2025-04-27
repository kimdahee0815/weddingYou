package com.mysite.weddingyou_backend.plannerProfile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.mysite.weddingyou_backend.review.Review;
import com.mysite.weddingyou_backend.review.ReviewDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlannerProfileDTO {
	
    private Long plannerProfileId;

    @NotNull
    private String plannerName;

    @Email
	@NotNull
    private String plannerEmail;
    
    @NotNull
    private String plannerProfileImg;

    @NotNull
    private int reviewCount;

    @NotNull
    private int matchingCount;
    
    
    @Pattern(regexp = "^\\d{3}-\\d{3,4}-\\d{4}$")
	@NotNull
	private String phoneNum;

	@NotNull
	private int career;

	private String introduction;
	
	private String reviewStars;
	
	private String reviewUsers;
	
	private String avgReviewStars;
	
    private List<ReviewDTO> reviews;

    private LocalDateTime plannerJoinDate;

      public static PlannerProfileDTO fromEntity(PlannerProfile profile) {
		PlannerProfileDTO plannerProfileDTO = new PlannerProfileDTO();
        plannerProfileDTO.setPlannerProfileId(profile.getPlannerProfileId());
        plannerProfileDTO.setPlannerName(profile.getPlannerName());
        plannerProfileDTO.setPlannerEmail(profile.getPlannerEmail());
        plannerProfileDTO.setPlannerProfileImg(profile.getPlannerProfileImg());
        plannerProfileDTO.setReviewCount(profile.getReviewCount());
        plannerProfileDTO.setReviewUsers(profile.getReviewUsers());
        plannerProfileDTO.setReviewStars(profile.getReviewStars());
        plannerProfileDTO.setAvgReviewStars(profile.getAvgReviewStars());
        plannerProfileDTO.setMatchingCount(profile.getMatchingCount());
        plannerProfileDTO.setCareer(profile.getPlannerCareerYears());
        plannerProfileDTO.setPhoneNum(profile.getPlannerPhoneNum());
        plannerProfileDTO.setIntroduction(profile.getIntroduction());
        plannerProfileDTO.setPlannerJoinDate(profile.getPlannerJoinDate());
        
        plannerProfileDTO.setReviews(profile.getReviews().stream()
            .map(ReviewDTO::fromEntity)
            .collect(Collectors.toList()));
        return plannerProfileDTO;
	}

    public PlannerProfile toEntity() {
        PlannerProfile plannerProfile = new PlannerProfile();
        plannerProfile.setPlannerProfileId(this.getPlannerProfileId());
        plannerProfile.setPlannerName(this.getPlannerName());
        plannerProfile.setPlannerEmail(this.getPlannerEmail());
        plannerProfile.setPlannerProfileImg(this.getPlannerProfileImg());
        plannerProfile.setReviewCount(this.getReviewCount());
        plannerProfile.setReviewUsers(this.getReviewUsers());
        plannerProfile.setReviewStars(this.getReviewStars());
        plannerProfile.setAvgReviewStars(this.getAvgReviewStars());
        plannerProfile.setMatchingCount(this.getMatchingCount());
        plannerProfile.setPlannerCareerYears(this.getCareer());
        plannerProfile.setPlannerPhoneNum(this.getPhoneNum());
        plannerProfile.setIntroduction(this.getIntroduction());
        plannerProfile.setPlannerJoinDate(this.getPlannerJoinDate());

        // Reviews는 ReviewDTO -> Review로 변환하여 설정
        List<Review> reviewList = this.getReviews().stream()
            .map(ReviewDTO::toEntity)
            .collect(Collectors.toList());
        plannerProfile.setReviews(reviewList);

        return plannerProfile;
    }
}
