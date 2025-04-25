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
@Table(name = "item")
public class Item {
	
		@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

		@Column(name = "item_img")
    private String itemImg;

		@Column(name="content",nullable=false)
		private String content;
	
		@Column(name="img_content",nullable=false)
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
			전체, 카테고리, 웨딩홀, 의상, 스튜디오, 메이크업, 신혼여행,부케
		}
	
		public enum Category2 {
			//웨딩홀
			일반, 호텔, 채플, 스몰, 야외, 전통혼례,
			//의상
			한복, 머메이드, A라인, H라인, 벨라인, 엠파이어, 프린세스, 남성예복, 
			//스튜디오
			인물중심, 배경중심, 균형적인,
			//메이크업
			헤어, 스모키, 러블리, 큐티, 네추럴, 포인트, 로맨틱한,
			//신혼여행
			국내, 해외,
			//부케
			라운드, 드롭,케스케이드, 핸드타이드
		}

}
