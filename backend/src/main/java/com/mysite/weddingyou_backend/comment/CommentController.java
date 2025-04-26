package com.mysite.weddingyou_backend.comment;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mysite.weddingyou_backend.qna.Qna;
import com.mysite.weddingyou_backend.qna.QnaRepository;
import com.mysite.weddingyou_backend.review.Review;
import com.mysite.weddingyou_backend.review.ReviewRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class CommentController {

	@Autowired
	public final CommentService commentService;
	
	@Autowired
	public final ReviewRepository reviewRepository;
	
	@Autowired
	public final QnaRepository qnaRepository;
	
	
	@PostMapping("/createcomment")
	public int createComments(@RequestParam Long estimateId, @RequestParam String email, @RequestParam String category,
			@RequestParam String commentContent){
		Review targetReview = reviewRepository.findByEstimateId(estimateId);
		Long reviewId = targetReview.getReviewId();
		CommentDTO commentdto = new CommentDTO();
		commentdto.setCommentContent(commentContent);
		int res = commentService.createComment(reviewId, commentdto, category, email);
		return res;
	}
	
	@PostMapping("/qna/createcomment")
	public int createQnaComments(@RequestParam Long qnaId, @RequestParam String email, @RequestParam String category,
			@RequestParam String commentContent){

		CommentDTO commentdto = new CommentDTO();
		commentdto.setCommentContent(commentContent);
		int res = commentService.createQnaComment(qnaId, commentdto, category, email);
		return res;
	}
	
	@PostMapping("/updatecomment")
	public List<Comment> updateComment(@RequestParam int index, @RequestParam Long estimateId, @RequestParam String commentContent){
		Review targetReview = reviewRepository.findByEstimateId(estimateId);
		Long reviewId = targetReview.getReviewId();
		return commentService.updateComments(index, targetReview, commentContent);
	}
	
	@PostMapping("/qna/updatecomment")
	public List<Comment> updateQnaComment(@RequestParam int index, @RequestParam Long qnaId, @RequestParam String commentContent){
		Qna targtetQna = qnaRepository.findById(qnaId).get();
		
		return commentService.updateQnaComments(index, targtetQna, commentContent);
	}
	
	@Transactional
	@PostMapping("/deletecomment")
	public List<Comment> deletecomment(@RequestParam int index, @RequestParam Long estimateId){
		Review targetReview = reviewRepository.findByEstimateId(estimateId);
		Long reviewId = targetReview.getReviewId();
		return commentService.deleteComments(index, targetReview);
	}
	
	@Transactional
	@PostMapping("/qna/deletecomment")
	public List<Comment> deleteQnacomment(@RequestParam int index, @RequestParam Long qnaId){
		Qna targetQna = qnaRepository.findById(qnaId).get();
		
		return commentService.deleteQnaComments(index, targetQna);
	}
	
//	@PostMapping("/getcomment")
//	public List<Comment> getComments(@RequestParam Long estimateId){
//		Review targetReview = reviewRepository.findByEstimateId(estimateId);
//		Long reviewId = targetReview.getReviewId();
//		System.out.println("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=" + reviewId);
//		List<Comment> commentData = commentService.getComments(reviewId);
//	
//		return commentData;
//	}
}
