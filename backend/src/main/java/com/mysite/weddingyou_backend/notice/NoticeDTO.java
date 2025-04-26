package com.mysite.weddingyou_backend.notice;

import java.time.LocalDateTime;

import javax.validation.constraints.NotNull;

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
public class NoticeDTO {
	
	@NotNull
	private Long noticeId;
	
	@NotNull
    private String noticeTitle;
    
	@NotNull
    private String noticeContent;
    
    private String noticeImg;

    private LocalDateTime noticeWriteDate;
    
    private int noticeViewCount;
    
 // 첨부 파일 
    public void setAttachment(String noticeImg) {
        this.noticeImg = noticeImg;
    }
    
	public static NoticeDTO fromEntity(Notice notice) {
		NoticeDTO NoticeDTO = new NoticeDTO();
		NoticeDTO.setNoticeId(notice.getNoticeId());
		NoticeDTO.setNoticeTitle(notice.getNoticeTitle());
		NoticeDTO.setNoticeContent(notice.getNoticeContent());
		NoticeDTO.setNoticeImg(notice.getNoticeImg());
		NoticeDTO.setNoticeWriteDate(notice.getNoticeWriteDate());
		NoticeDTO.setNoticeViewCount(notice.getNoticeViewCount());
        return NoticeDTO;
	}
}