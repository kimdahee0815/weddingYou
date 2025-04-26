package com.mysite.weddingyou_backend.mypageAdmin;

import java.time.LocalDateTime;

import com.mysite.weddingyou_backend.plannerRegister.PlannerRegister.Gender;

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
@Table(name = "MypageAdmin")
public class MypageAdmin {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
	private Long adminId;
	
	@Column(name = "UsersType")
	private String type;
	
//	public void setType(String type) {
//        this.type = type;
//    }
	
	//user
	@Column(name = "user_email")
	private String userEmail;
	
	@Column(name = "user_name")
	private String userName;
	
	@Column(name = "user_password")
	private String userPassword;
	
	@Column(name = "user_gender")
	private Gender userGender;
	
	@Column(name = "user_phoneNum")
	private String userPhoneNum;
	
	@Column(name = "user_join_date")
	private LocalDateTime userJoinDate;
	
	//planner
	@Column(name = "planner_email")
	private String plannerEmail;
	
	@Column(name = "planner_name")
	private String plannerName;
	
	@Column(name = "planner_password")
	private String plannerPassword;
	
	@Column(name = "planner_gender")
	private Gender plannerGender;
	
	@Column(name = "planner_phoneNum")
	private String plannerPhoneNum;
	
	@Column(name = "planner_join_date")
	private LocalDateTime plannerJoinDate;
	
	@Column(name = "planner_career_years")
	private Integer plannerCareerYears;
	
}
