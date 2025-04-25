package com.mysite.weddingyou_backend.like;

import java.time.LocalDateTime;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.mysite.weddingyou_backend.item.Item;
import com.mysite.weddingyou_backend.item.Item.Category1;
import com.mysite.weddingyou_backend.item.Item.Category2;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLogin;
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
		
	private UserLogin user;

	private PlannerLogin planner;
	
	private String location;

	private String email;
	
	private Long itemId;

	private String sortBy;

	private Category1 category1;

	private LocalDateTime likeWriteDate;

	public static likeDTO fromEntity(LikeEntity likeEntity) {
		if (likeEntity == null) return null;

    likeDTO dto = new likeDTO();
    dto.setItemId(likeEntity.getItem() != null ? likeEntity.getItem().getItemId() : null);
    dto.setLikeWriteDate(likeEntity.getLikeWriteDate());
    dto.setLocation(likeEntity.getLocation());
		dto.setItem(likeEntity.getItem());

    if (likeEntity.getUser() != null) {
        dto.setEmail(likeEntity.getUser().getEmail());
				dto.setUser(likeEntity.getUser());
    } else if (likeEntity.getPlanner() != null) {
        dto.setEmail(likeEntity.getPlanner().getEmail());
				dto.setPlanner(likeEntity.getPlanner());
    }

    return dto;
}	
    
}
