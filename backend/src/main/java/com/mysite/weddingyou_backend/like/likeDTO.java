package com.mysite.weddingyou_backend.like;

import java.time.LocalDateTime;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.mysite.weddingyou_backend.item.Item;
import com.mysite.weddingyou_backend.item.Item.Category1;
import com.mysite.weddingyou_backend.item.Item.Category2;
import com.mysite.weddingyou_backend.userLogin.UserLogin;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class likeDTO {
	@NotNull
	private Long likeId;
	    
	@NotNull
	private Item item;
		
	   
	@NotNull
	private UserLogin user;

	@NotNull
	private Integer likeCount;
	    
	
	private String location;

	private String email;
	
	private Long itemId;
	
	private Category1 category1;
	
	private String sortBy;

	public static likeDTO fromEntity(LikeEntity likeEntity) {
		likeDTO dto = new likeDTO();
		return dto;
}
    
}
