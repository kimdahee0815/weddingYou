package com.mysite.weddingyou_backend.notice;

import java.time.LocalDateTime;

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
@Table(name = "Notice")
public class Notice {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private long noticeId;
	
	@Column(name = "notice_img")
    private String noticeImg;
	
	@Column(name = "notice_title")
	private String noticeTitle;
	
	@Column(name = "notice_content")
	private String noticeContent;
	
	@Column(name = "notice_viewcount")
	private int noticeViewCount;
	
	@Column(name = "notice_write_date")
    private LocalDateTime noticeWriteDate;
}