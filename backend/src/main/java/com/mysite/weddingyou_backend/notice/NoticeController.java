package com.mysite.weddingyou_backend.notice;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mysite.weddingyou_backend.S3Service;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDelete;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDeleteDTO;

@RestController
@RequestMapping("/notice")
public class NoticeController {

	private final NoticeService noticeService;
	private final S3Service s3Service;

	public NoticeController(NoticeService noticeService, S3Service s3Service) {
		this.noticeService = noticeService;
		this.s3Service = s3Service;
	}
	
	@GetMapping("/list")
	public List<NoticeDTO> getAllNotices() {
	    return noticeService.getAllNotices();
	}

	@PostMapping("/post")
	public ResponseEntity<NoticeDTO> createNotice(@RequestParam(required=false) MultipartFile file,
			@RequestParam("title") String title,@RequestParam("content") String content) {
		try {
			NoticeDTO noticeDTO = new NoticeDTO();
			noticeDTO.setNoticeTitle(title);
			noticeDTO.setNoticeContent(content);
			noticeDTO.setNoticeViewCount(0);

			noticeDTO.setAttachment(null);
				if (!file.isEmpty()) {
					String imgUrl = s3Service.uploadFile(file, "notice");
					noticeDTO.setAttachment(imgUrl); 
        }

			NoticeDTO newNotice = noticeService.createNotice(noticeDTO);
			return ResponseEntity.ok(newNotice);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PostMapping("/update/{noticeId}")
	public NoticeDTO updateNotice(@PathVariable Long noticeId, @RequestParam(required=false) MultipartFile file,
			@RequestParam("title") String title,@RequestParam("content") String content) throws IOException {
		NoticeDTO noticeDTO = new NoticeDTO();
		noticeDTO.setNoticeTitle(title);
		noticeDTO.setNoticeContent(content);

		noticeDTO.setAttachment(null);
		if (!file.isEmpty()) {
			String imgUrl = s3Service.uploadFile(file, "notice");
			noticeDTO.setAttachment(imgUrl); 
    }
		return noticeService.updateNotice(noticeId, noticeDTO);

	}

	@DeleteMapping("/delete/{noticeId}")
	public void deleteNotice(@PathVariable Long noticeId) {
		noticeService.deleteNotice(noticeId);
	}

	@GetMapping("/{noticeId}")
	public NoticeDTO getNoticeById(@PathVariable Long noticeId) {
		return noticeService.getNoticeById(noticeId);
	}

	@GetMapping("/search/{keyword}")
	public List<NoticeDTO> searchNotices(@RequestParam String keyword) {
		return noticeService.searchNotices(keyword);
	}
	
	@PostMapping("/addviewcount")
	public Notice addviewcount(@RequestParam Long noticeId) {
		Notice notice = noticeService.getNoticeById2(noticeId);
		int view = notice.getNoticeViewCount();
		notice.setNoticeViewCount(view+1);
		noticeService.save(notice);
		return notice;
	}
	
	 @RequestMapping(value="/noticeimg",  produces = MediaType.IMAGE_JPEG_VALUE)
	 public ResponseEntity<byte[]> imgView(@RequestParam("image") String imageUrl) throws MalformedURLException {
			String fullPath = imageUrl;
    
			if(fullPath != null){
				String key = fullPath.substring(fullPath.indexOf(".com/") + 5);
				key = URLDecoder.decode(key, StandardCharsets.UTF_8);
				byte[] imageBytes = s3Service.downloadFile(key);
	
				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(MediaType.IMAGE_JPEG);
	
				return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK); 
			}
		return ResponseEntity.notFound().build();
  }
}
