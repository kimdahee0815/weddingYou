package com.mysite.weddingyou_backend.review;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mysite.weddingyou_backend.comment.Comment;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Review")
public class Review {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;
	
	
	@Column(name = "review_img", length=1000000000, nullable = true)
    private String reviewImg;
	
	@Column(name = "review_text", nullable = false)
	private String reviewText;
	
	@Column(name = "review_stars", nullable = false)
	private int reviewStars;
	
	@Column(name = "review_date", nullable = false)
	private LocalDateTime reviewDate;
	
	@Column(name = "user_email", nullable = false)
	private String userEmail;

	@Column(name = "planner_email", nullable = false)
	private String plannerEmail;
	
	@Column(name = "estimate_id", nullable = false, unique=true)
	private Long estimateId;

	@Column(name="review_title", nullable=false)
	private String reviewTitle;
	
	@Column(name="review_counts", nullable=false)
	private int reviewCounts;
		
	// 댓글
	@JsonManagedReference
	@OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Comment> comments = new ArrayList<>();

//	@ManyToOne(fetch = FetchType.LAZY)
//	@JoinColumn(name = "user_email", referencedColumnName = "email", insertable = false, updatable = false, nullable = false)
//	private UserLogin userLogin;
//
//	@ManyToOne(fetch = FetchType.LAZY)
//	@JoinColumn(name = "planner_email", referencedColumnName = "email", insertable = false, updatable = false, nullable = false)
//	private PlannerLogin plannerLogin;

}