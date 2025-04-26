package com.mysite.weddingyou_backend.plannerProfile;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "PlannerProfile")
public class PlannerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plannerProfile_id")
    private Long plannerProfileId;

    @Column(name = "planner_name", nullable = false)
    private String plannerName;

    @Column(name = "planner_email", unique = true, nullable = false)
    private String plannerEmail;
    
    @Column(name = "planner_profileImg")
    private String plannerProfileImg;

    @Column(name = "planner_reviewCount", nullable = false)
    @ColumnDefault("0")
    private int reviewCount;
    
    @Column(name = "planner_reviewUsers", nullable = false)
    private String reviewUsers;
    
    @Column(name = "planner_reviewStars", nullable = false)
    private String reviewStars;
    
    @Column(name = "planner_avgReviewStars", nullable = false)
    private String avgReviewStars;

    @Column(name = "planner_matchingCount", nullable = false)
    @ColumnDefault("0")
    private int matchingCount;
    
    @Column(name = "planner_career_years", nullable = false)
	private int plannerCareerYears;
    
    @Column(name = "planner_phoneNum", nullable = false)
   	private String plannerPhoneNum;

    @Column(name = "planner_Introduction", length=1000000000)
    private String introduction;
  
    @Column(name = "planner_JoinDate")
    private LocalDateTime plannerJoinDate;
    
}
