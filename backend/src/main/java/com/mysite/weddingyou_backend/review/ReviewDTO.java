package com.mysite.weddingyou_backend.review;

import java.time.LocalDateTime;
import java.util.List;

import com.mysite.weddingyou_backend.comment.CommentDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewDTO {

	private long reviewId;

	//작성자
	private String userEmail;
    
    // 별점
    private int reviewStars;
    
	//제목
	private String reviewTitle;

	//내용
	private String reviewContent;

	//첨부파일
	private String reviewImg;

	//작성일
	private LocalDateTime reviewWriteDate;
	
	private int reviewCounts;
	
    public void setAttachment(String reviewImg) {
        this.reviewImg = reviewImg;
    }
	
	public static ReviewDTO fromEntity(Review review) {
		ReviewDTO reviewDTO = new ReviewDTO();
		reviewDTO.setReviewId(review.getReviewId());
        reviewDTO.setUserEmail(review.getUserEmail());
        reviewDTO.setReviewStars(review.getReviewStars());
		reviewDTO.setReviewTitle(review.getReviewTitle());
		reviewDTO.setReviewContent(review.getReviewText());
		reviewDTO.setReviewCounts(review.getReviewCounts());
		reviewDTO.setReviewImg(review.getReviewImg());
		reviewDTO.setReviewWriteDate(review.getReviewDate());

		return reviewDTO;
	}
	
    private List<CommentDTO> comments;

}