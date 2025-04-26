package com.mysite.weddingyou_backend.userUpdateDelete;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.mysite.weddingyou_backend.like.LikeEntity;
import com.mysite.weddingyou_backend.userRegister.UserRegister.Gender;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity // 물리적인 테이블을 생성
@Setter
@Getter
@Table(name = "User") //UserEntity클래스를 사용해서 user라는 테이블이 만들어짐
public class UserUpdateDelete {
	@Id // pk 지정
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long userId;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "password", nullable = false)
	private String password;

	@Column(name = "phone_number", nullable = false)
	private String phoneNum;

	@Column(name = "user_img", nullable = true)
	private String userImg;
	
	@Enumerated(EnumType.STRING) // Enum 값을 String 형태로 저장
	private Gender gender;

	@Column(name = "user_join_date", nullable = false)
	private LocalDateTime userJoinDate;

	@PrePersist
	protected void onCreate() {
    this.userJoinDate = LocalDateTime.now();
	}

}