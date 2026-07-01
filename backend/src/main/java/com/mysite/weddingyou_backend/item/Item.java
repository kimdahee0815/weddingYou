package com.mysite.weddingyou_backend.item;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mysite.weddingyou_backend.like.LikeEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Item")
public class Item {
	
		@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

		@Column(name = "item_img")
    private String itemImg;

		@Column(name="content",nullable=false, columnDefinition = "TEXT")
		private String content;
	
		@Column(name="img_content",nullable=false, columnDefinition = "TEXT")
		private String imgContent;
	
		@JsonManagedReference
		@OneToMany(mappedBy = "item", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
		private List<LikeEntity> like;

		public void addLike(LikeEntity likeEntity) {
			if (like == null) {
        like = new ArrayList<>();
    	}
			if (!like.contains(likeEntity)) { 
				like.add(likeEntity);
				likeEntity.setItem(this);
			}
		}

		public void removeLike(LikeEntity likeEntity) {
			if (like != null) {
				like.remove(likeEntity);
				likeEntity.setItem(null);
			}
		}

		@Column(name = "item_name", nullable = false)
    private String itemName;
	
		@Column(name = "item_write_date")
    private LocalDateTime itemWriteDate;
	
		@Column(name ="like_write_date")
    private LocalDateTime likeWriteDate;
	
		@Enumerated(EnumType.STRING)
		@Column(name = "category1", nullable = false)
    private Category1 category1;

		@Enumerated(EnumType.STRING)
		@Column(name = "category2", nullable = false)
    private Category2 category2;
	
		public enum Category1 {
			All, Category, WeddingHall, Outfit, Studio, Makeup, Honeymoon, Bouquet
		}

		public enum Category2 {
			// Wedding Hall
			Standard, Hotel, Chapel, Small, Outdoor, Traditional,
			// Outfit
			Mermaid, Aline, Hline, BallGown, Empire, Princess, MensSuit, Hanbok,
			// Studio
			SubjectFocused, BackgroundFocused, Balanced,
			// Makeup
			Hair, Romantic, Point, Natural, Smoky, Cute, Lovely,
			// Honeymoon
			International, Domestic,
			// Bouquet
			Round, Drop, Cascade, HandTied
		}

}
