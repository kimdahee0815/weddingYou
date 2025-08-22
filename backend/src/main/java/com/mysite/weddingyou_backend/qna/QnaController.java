package com.mysite.weddingyou_backend.qna;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mysite.weddingyou_backend.S3Service;
import com.mysite.weddingyou_backend.comment.CommentDTO;
import com.mysite.weddingyou_backend.notice.Notice;
import com.mysite.weddingyou_backend.notice.NoticeDTO;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLogin;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLoginRepository;
import com.mysite.weddingyou_backend.userLogin.UserLogin;
import com.mysite.weddingyou_backend.userLogin.UserLoginRepository;

@RestController
@RequestMapping("/qna")
public class QnaController {
	
    private final QnaService qnaService;
		private final S3Service s3Service;
	private final UserLoginRepository userLoginRepository;
	private final PlannerLoginRepository plannerLoginRepository;

    @Autowired
    public QnaController(QnaService qnaService, UserLoginRepository userLoginRepository,
			PlannerLoginRepository plannerLoginRepository, S3Service s3Service) {
        this.qnaService = qnaService;
        this.userLoginRepository = userLoginRepository;
		this.plannerLoginRepository = plannerLoginRepository;
		this.s3Service = s3Service;
    }
    @PostMapping("/post")
	public ResponseEntity<QnaDTO> createQna(@RequestParam(required=false) MultipartFile file,
			@RequestParam("title") String title,@RequestParam("content") String content, @RequestParam("email") String email) {
			try {
				QnaDTO qnaDTO = new QnaDTO();
				qnaDTO.setQnaTitle(title);
				qnaDTO.setQnaContent(content);
				qnaDTO.setQnaViewCount(0);
				qnaDTO.setQnaWriter(email);
			
				qnaDTO.setQnaImg(null);
				if (!file.isEmpty()) {
					String imgUrl = s3Service.uploadFile(file, "qna");
					qnaDTO.setQnaImg(imgUrl); 
        }

			QnaDTO qnadto = qnaService.createQna(qnaDTO);
			return ResponseEntity.ok(qnadto);
			} catch (Exception e) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
			}
	}
   

    @PostMapping("/update/{qnaId}")
    public QnaDTO updateQna(@PathVariable Long qnaId, @RequestParam(required=false) MultipartFile file,
			@RequestParam("title") String title,@RequestParam("content") String content) throws IOException {
    	QnaDTO qnaDTO = new QnaDTO();
    	qnaDTO.setQnaTitle(title);
    	qnaDTO.setQnaContent(content);

			qnaDTO.setQnaImg(null);
			if (file != null && !file.isEmpty()) {
				String imgUrl = s3Service.uploadFile(file, "qna");
				qnaDTO.setQnaImg(imgUrl); 
			}

		return qnaService.updateQna(qnaId, qnaDTO);
    
    }
    
    @GetMapping("/{qnaId}")
    public Qna getQna(@PathVariable Long qnaId) {
        return qnaService.getQnaById2(qnaId).get();
    }

    @DeleteMapping("/delete/{qnaId}")
    public void deleteQna(@PathVariable Long qnaId) {
        qnaService.deleteQna(qnaId);
    }

    @GetMapping("/list")
    public List<Qna> getAllQnas() {
        return qnaService.getAllQnas2();
    }

    @GetMapping("/search/{keyword}")
    public List<Qna> searchQnas(@PathVariable String keyword) {
        return qnaService.searchQnas(keyword);
    }

    @PostMapping("/{qnaId}/comments")
    public ResponseEntity<CommentDTO> createComment(@PathVariable Long qnaId,
            @RequestBody CommentDTO commentDTO) {
        CommentDTO newComment = qnaService.createComment(qnaId, commentDTO);
        return ResponseEntity.ok(newComment);
    }

    @PutMapping("/{qnaId}/comments/{commentId}")
    public CommentDTO updateComment(@PathVariable Long commentId, @RequestBody CommentDTO commentDTO) {
        return qnaService.updateComment(commentId, commentDTO);
    }

    @DeleteMapping("/{qnaId}/comments/{commentId}")
    public void deleteComment(@PathVariable Long commentId) {
        qnaService.deleteComment(commentId);
    }
    
    @PostMapping("/addviewcount")
	public Qna addviewcount(@RequestParam Long qnaId) {
		Optional<Qna> qna = qnaService.getQnaById2(qnaId);
		Qna targetQna = qna.get();
		int view = targetQna.getQnaViewCount();
		targetQna.setQnaViewCount(view+1);
		qnaService.save(targetQna);
		return targetQna;
	}
  
	@RequestMapping("/qnaimg")
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