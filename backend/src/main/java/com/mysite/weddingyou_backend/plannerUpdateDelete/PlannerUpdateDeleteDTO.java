package com.mysite.weddingyou_backend.plannerUpdateDelete;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.mysite.weddingyou_backend.plannerRegister.PlannerRegister.Gender;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlannerUpdateDeleteDTO {
	
	@NotNull
	private String name;

	@Email
	@NotNull
	private String email;

	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")
	@NotNull
	private String password;
	
	@NotNull
	private Gender gender;
	
	@NotNull
	private String career;

	@Pattern(regexp = "^\\d{3}-\\d{3,4}-\\d{4}$")
	@NotNull
	private String phoneNum;
	
	@Email
	@NotNull
	private String preemail;
	
	private String introduction;
	
}
