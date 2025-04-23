package com.mysite.weddingyou_backend.plannerRegister;

import java.time.LocalDateTime;

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

@Getter
@Setter
@Entity
@Table(name = "planner")
public class PlannerRegister {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "planner_id")
    private Long plannerId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone_number", nullable = false)
    private String phoneNum;
    
//    @Column(name = "planner_img")
//    private byte[] plannerImg;
    
    @Column(name = "planner_career_years", nullable = false)
    private int career;
    
    @Enumerated(EnumType.STRING) // Enum 값을 String 형태로 저장
    private Gender gender;

    @Column(name = "planner_join_date", nullable = false)
	private LocalDateTime plannerJoinDate;

	@PrePersist
	protected void onCreate() {
    this.plannerJoinDate = LocalDateTime.now();
	}
    
    public enum Gender {
    	male,
    	female
    }
}
