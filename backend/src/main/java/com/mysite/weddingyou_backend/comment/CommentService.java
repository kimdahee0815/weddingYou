package com.mysite.weddingyou_backend.comment;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mysite.weddingyou_backend.plannerLogin.PlannerLogin;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLoginRepository;
import com.mysite.weddingyou_backend.qna.Qna;
import com.mysite.weddingyou_backend.qna.QnaRepository;
import com.mysite.weddingyou_backend.review.Review;
import com.mysite.weddingyou_backend.review.ReviewRepository;
import com.mysite.weddingyou_backend.userLogin.UserLogin;
import com.mysite.weddingyou_backend.userLogin.UserLoginRepository;

@Service
public class CommentService {

	private final CommentRepository commentRepository;
	private final UserLoginRepository userLoginRepository;
	private final PlannerLoginRepository plannerLoginRepository;
	private final ReviewRepository reviewRepository;
	private final QnaRepository qnaRepository;

	public CommentService(CommentRepository commentRepository, UserLoginRepository userLoginRepository,
			PlannerLoginRepository plannerLoginRepository, ReviewRepository reviewRepository, QnaRepository qnaRepository) {
		this.commentRepository = commentRepository;
		this.userLoginRepository = userLoginRepository;
		this.plannerLoginRepository = plannerLoginRepository;
		this.reviewRepository = reviewRepository;
		this.qnaRepository = qnaRepository;
	}

	public int createComment(Long reviewId, CommentDTO commentDTO, String category, String email) {
	//	String category = (String) session.getAttribute("category");
	//	String email = (String) session.getAttribute("email");
		int res = 0;
		Comment comment = new Comment();
		comment.setCommentContent(commentDTO.getCommentContent());
		comment.setCommentDate(LocalDateTime.now());
		if ("user".equals(category)) {
			UserLogin user = userLoginRepository.findByEmail(email);
			if (user != null) {
				comment.setCommentWriter(user.getName());
				comment.setCommentEmail(user.getEmail());
			}
		} else if ("planner".equals(category)) {
			PlannerLogin planner = plannerLoginRepository.findByEmail(email);
			if (planner != null) {
				comment.setCommentWriter(planner.getName());
				comment.setCommentEmail(planner.getEmail());
			}
		}
		Optional<Review> review = reviewRepository.findById(reviewId);
		Review targetReview = review.orElse(null);
		comment.setReview(targetReview);

		commentRepository.save(comment);
		res = 1;
		return res;
	}
	
	public int createQnaComment(Long qnaId, CommentDTO commentDTO, String category, String email) {
		//	String category = (String) session.getAttribute("category");
		//	String email = (String) session.getAttribute("email");
			int res = 0;
			Comment comment = new Comment();
			comment.setCommentContent(commentDTO.getCommentContent());
			comment.setCommentDate(LocalDateTime.now());
			if ("user".equals(category)) {
				UserLogin user = userLoginRepository.findByEmail(email);
				if (user != null) {
					comment.setCommentWriter(user.getName());
					comment.setCommentEmail(user.getEmail());
				}
			} else if ("planner".equals(category)) {
				PlannerLogin planner = plannerLoginRepository.findByEmail(email);
				if (planner != null) {
					comment.setCommentWriter(planner.getName());
					comment.setCommentEmail(planner.getEmail());
				}
			}
			Optional<Qna> qna = qnaRepository.findById(qnaId);
			Qna targetQna = qna.orElse(null);
			comment.setQna(targetQna);

			commentRepository.save(comment);
			res = 1;
			return res;
		}
	
//	public List<Comment> getComments(Long reviewId){
//		List<Comment> commentData = new ArrayList<>();
//		commentData = commentRepository.findAllByReview(reviewId);
//		
//		return commentData;
//	}
	
	public List<Comment> updateComments(int index, Review targetReview, String commentContent){
	List<Comment> commentData = new ArrayList<>();
	commentData = commentRepository.findAllByReview(targetReview);
	for(int i =0;i<commentData.size();i++) {
		if(i==index) {
			Comment targetComment = commentData.get(i);
			targetComment.setCommentContent(commentContent);
			targetComment.setCommentDate(LocalDateTime.now());
			commentRepository.save(targetComment);
		}
		
	}
	return commentData;
}
	
	public List<Comment> updateQnaComments(int index, Qna targetQna, String commentContent){
		List<Comment> commentData = new ArrayList<>();
		commentData = commentRepository.findAllByQna(targetQna);
		for(int i =0;i<commentData.size();i++) {
			if(i==index) {
				Comment targetComment = commentData.get(i);
				targetComment.setCommentContent(commentContent);
				targetComment.setCommentDate(LocalDateTime.now());
				commentRepository.save(targetComment);
			}
			
		}
		return commentData;
	}
	
	public List<Comment> deleteComments(int index, Review targetReview){
		List<Comment> commentData = new ArrayList<>();
		commentData = commentRepository.findAllByReview(targetReview);
		for(int i =0;i<commentData.size();i++) {
			if(i==index) {
				Comment targetComment = commentData.get(i);
			
				commentRepository.delete(targetComment);
			}
			
		}
		return commentData;
	}
	
	public List<Comment> deleteQnaComments(int index, Qna targetQna){
		List<Comment> commentData = new ArrayList<>();
		commentData = commentRepository.findAllByQna(targetQna);
		for(int i =0;i<commentData.size();i++) {
			if(i==index) {
				Comment targetComment = commentData.get(i);
			
				commentRepository.delete(targetComment);
			}
			
		}
		return commentData;
	}
}