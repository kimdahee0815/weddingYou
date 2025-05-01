package com.mysite.weddingyou_backend.review;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.mysite.weddingyou_backend.comment.CommentDTO;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLogin;
import com.mysite.weddingyou_backend.plannerProfile.PlannerProfile;
import com.mysite.weddingyou_backend.userLogin.UserLogin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewDTO {

	private long reviewId;

	//작성자
	private String userEmail;

    private UserLogin user;
    
    // 별점
    private int reviewStars;
    
	//제목
	private String reviewTitle;

	//내용
	private String reviewText;

	//첨부파일
	private String reviewImg;

	//작성일
	private LocalDateTime reviewDate;
	
	private int reviewCounts;

	private String plannerEmail;

	private List<CommentDTO> comments;
	
    public void setAttachment(String reviewImg) {
        this.reviewImg = reviewImg;
    }
	
	public static ReviewDTO fromEntity(Review review) {
        if (review == null) {
            return null;
        }

        ReviewDTO dto = new ReviewDTO();
        dto.setReviewId(review.getReviewId());
        dto.setReviewTitle(review.getReviewTitle());
        dto.setReviewText(review.getReviewText());
        dto.setReviewStars(review.getReviewStars());
        dto.setReviewDate(review.getReviewDate());
        dto.setUserEmail(review.getUserEmail());
        dto.setPlannerEmail(review.getPlannerEmail());
        dto.setUser(review.getUser());

        if (review.getComments() != null) {
            dto.setComments(review.getComments().stream()
                    .map(CommentDTO::fromEntity)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

	public Review toEntity() {
        Review review = new Review();
        review.setReviewId(this.getReviewId());
        review.setReviewImg(this.getReviewImg());
        review.setReviewText(this.getReviewText());
        review.setReviewStars(this.getReviewStars());
        review.setReviewDate(this.getReviewDate());
        review.setUserEmail(this.getUserEmail());
        review.setPlannerEmail(this.getPlannerEmail());
        review.setReviewTitle(this.getReviewTitle());
        review.setReviewCounts(this.getReviewCounts());
        review.setUser(this.getUser());
        
        // 관련된 엔티티 (plannerProfile, user, planner) 설정
        PlannerProfile plannerProfile = new PlannerProfile();
        plannerProfile.setPlannerEmail(this.getPlannerEmail());
        review.setPlannerProfile(plannerProfile);
        
        UserLogin userLogin = new UserLogin();
        userLogin.setEmail(this.getUserEmail());
        review.setUser(userLogin);
        
        PlannerLogin plannerLogin = new PlannerLogin();
        plannerLogin.setEmail(this.getPlannerEmail());
        review.setPlanner(plannerLogin);
        
        return review;
    }
}