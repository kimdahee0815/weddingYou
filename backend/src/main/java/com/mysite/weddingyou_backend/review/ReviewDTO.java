package com.mysite.weddingyou_backend.review;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

    private long estimateId;

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

	private List<CommentDTO> comments = new ArrayList<>(); 
    
    public void setAttachment(String reviewImg) {
        this.reviewImg = reviewImg;
    }
	
	public static ReviewDTO fromEntity(Review review) {
        if (review == null) {
            return null;
        }

        ReviewDTO dto = new ReviewDTO();
        dto.setReviewId(review.getReviewId());
        dto.setReviewCounts(review.getReviewCounts());
        dto.setReviewTitle(review.getReviewTitle());
        dto.setReviewText(review.getReviewText());
        dto.setReviewStars(review.getReviewStars());
        dto.setReviewDate(review.getReviewDate());
        dto.setUserEmail(review.getUserEmail());
        dto.setPlannerEmail(review.getPlannerEmail());
        dto.setEstimateId(review.getEstimateId());
        dto.setReviewImg(review.getReviewImg());
        dto.setUser(review.getUser());

        if (review.getComments() != null) {
            List<CommentDTO> commentDTOs = review.getComments().stream()
            .map(CommentDTO::fromEntity)
            .collect(Collectors.toList());

            dto.getComments().addAll(commentDTOs);
        } else {
            List<CommentDTO> emptyCommentDTOs = new ArrayList<>();
            dto.setComments(emptyCommentDTOs);  
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
        review.setEstimateId(this.getEstimateId()); 
        review.setReviewCounts(this.getReviewCounts());
        review.setUser(this.getUser());

        PlannerProfile plannerProfile = new PlannerProfile();
        plannerProfile.setPlannerEmail(this.getPlannerEmail());
        review.setPlannerProfile(plannerProfile);

        // PlannerLogin plannerLogin = new PlannerLogin();
        // plannerLogin.setEmail(this.getPlannerEmail());
        // review.setPlanner(plannerLogin);
        
        return review;
    }
}