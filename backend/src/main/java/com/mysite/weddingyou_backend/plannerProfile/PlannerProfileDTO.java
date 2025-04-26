package com.mysite.weddingyou_backend.plannerProfile;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlannerProfileDTO {
	
    private Long plannerProfileId;

    @NotNull
    private String plannerName;

    @Email
	@NotNull
    private String plannerEmail;
    
    @NotNull
    private String plannerProfileImg;

    @NotNull
    private int reviewCount;

    @NotNull
    private int matchingCount;
    
    
    @Pattern(regexp = "^\\d{3}-\\d{3,4}-\\d{4}$")
	@NotNull
	private String phoneNum;

	@NotNull
	private int career;

	private String introduction;
	
	private String reviewStars;
	
	private String reviewUsers;
	
	private String avgReviewStars;
	
 

}
