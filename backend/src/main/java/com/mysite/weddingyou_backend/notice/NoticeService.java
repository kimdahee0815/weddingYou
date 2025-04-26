package com.mysite.weddingyou_backend.notice;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoticeService {

	private final NoticeRepository noticeRepository;

	public NoticeService(NoticeRepository noticeRepository) {
		this.noticeRepository = noticeRepository;
	}
	
	public List<NoticeDTO> getAllNotices() {
	    List<Notice> notices = noticeRepository.findAll();
	    return notices.stream().map(NoticeDTO::fromEntity).collect(Collectors.toList());
	}

	public NoticeDTO createNotice(NoticeDTO noticeDTO) {
		Notice notice = new Notice();
		notice.setNoticeImg(noticeDTO.getNoticeImg());
		notice.setNoticeTitle(noticeDTO.getNoticeTitle());
		notice.setNoticeContent(noticeDTO.getNoticeContent());
		notice.setNoticeWriteDate(LocalDateTime.now());
		Notice savedNotice = noticeRepository.save(notice);
		return NoticeDTO.fromEntity(savedNotice);

	}

	public NoticeDTO updateNotice(Long noticeId, NoticeDTO noticeDTO) {
		Notice notice = noticeRepository.findById(noticeId).orElseThrow(() -> new IllegalArgumentException("불러오기 실패"));
		notice.setNoticeImg(noticeDTO.getNoticeImg());
		notice.setNoticeTitle(noticeDTO.getNoticeTitle());
		notice.setNoticeContent(noticeDTO.getNoticeContent());
		notice.setNoticeWriteDate(LocalDateTime.now());
		Notice updatedNotice = noticeRepository.save(notice);
		return NoticeDTO.fromEntity(updatedNotice);
	}

	public void deleteNotice(Long noticeId) {
		noticeRepository.deleteById(noticeId);
	}

	public NoticeDTO getNoticeById(Long noticeId) {
		Notice notice = noticeRepository.findById(noticeId).orElseThrow(() -> new IllegalArgumentException("불러오기 실패"));
		return NoticeDTO.fromEntity(notice);
	}
	
	public Notice getNoticeById2(Long noticeId) {
		Notice notice = noticeRepository.findById(noticeId).orElseThrow(() -> new IllegalArgumentException("불러오기 실패"));
		return notice;
	}

	public List<NoticeDTO> searchNotices(String keyword) {
		List<Notice> notices = noticeRepository.findByNoticeTitleContaining(keyword);
		return notices.stream().map(NoticeDTO::fromEntity).collect(Collectors.toList());
	}
	
	public void save(Notice notice) {
		noticeRepository.save(notice);
	}
}