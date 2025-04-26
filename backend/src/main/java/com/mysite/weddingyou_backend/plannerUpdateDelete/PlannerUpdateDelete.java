package com.mysite.weddingyou_backend.plannerUpdateDelete;

import java.time.LocalDateTime;

import com.mysite.weddingyou_backend.plannerRegister.PlannerRegister.Gender;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity // 물리적인 테이블을 생성
@Setter
@Getter
@Table(name = "Planner") //PlannerEntity클래스를 사용해서 planner라는 테이블이 만들어짐
public class PlannerUpdateDelete {
	@Id // pk 지정
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "planner_id")
	private Long plannerId;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "password", nullable = false)
	private String password;

	@Column(name = "phone_number", nullable = false)
	private String phoneNum;

	@Column(name = "planner_img", nullable = true)
	private String plannerImg;
	
	@Column(name = "planner_career_years", nullable = false)
	private String plannerCareerYears;

	@Column(name = "planner_introduction", nullable = true)
	private String introduction;
	
	@Enumerated(EnumType.STRING) // Enum 값을 String 형태로 저장
	private Gender gender;

	@Column(name = "planner_join_date", nullable = false)
	private LocalDateTime plannerJoinDate;

	@PrePersist
	protected void onCreate() {
    this.plannerJoinDate = LocalDateTime.now();
	}
	
	 

	

}
