package com.mysite.weddingyou_backend.userUpdateDelete;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mysite.weddingyou_backend.comment.Comment;
import com.mysite.weddingyou_backend.comment.CommentRepository;
import com.mysite.weddingyou_backend.estimate.Estimate;
import com.mysite.weddingyou_backend.estimate.EstimateRepository;
import com.mysite.weddingyou_backend.like.LikeEntity;
import com.mysite.weddingyou_backend.like.LikeRepository;
import com.mysite.weddingyou_backend.mypageAdmin.MypageAdmin;
import com.mysite.weddingyou_backend.mypageAdmin.MypageAdminRepository;
import com.mysite.weddingyou_backend.payment.Payment;
import com.mysite.weddingyou_backend.payment.PaymentRepository;
import com.mysite.weddingyou_backend.qna.Qna;
import com.mysite.weddingyou_backend.qna.QnaRepository;
import com.mysite.weddingyou_backend.review.Review;
import com.mysite.weddingyou_backend.review.ReviewRepository;

import jakarta.persistence.EntityNotFoundException;


@Service
@Transactional
public class UserUpdateDeleteService {

	@Autowired
	private UserUpdateDeleteRepository userRepository;

	@Autowired
	private EstimateRepository estimateRepository;

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private ReviewRepository reviewRepository;

	@Autowired
	private CommentRepository commentRepository;

	@Autowired
	private QnaRepository qnaRepository;

	@Autowired
	private MypageAdminRepository mypageAdminRepository;

	@Autowired
	private LikeRepository likeRepository;
	
	public UserUpdateDelete getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
	
	
	public void save(UserUpdateDelete user) {
		//repository의 save 메소드 소환
		userRepository.save(user);
		// repository의 save 메서드 호출(조건. entity 객체를 넘겨줘야 함)
	}
	
	public void delete(UserUpdateDelete user) {
		if (user != null) {
        List<LikeEntity> likes = likeRepository.findByUserEmail(user.getEmail());
        likeRepository.deleteAll(likes);
        List<Estimate> estimates = estimateRepository.findAllByWriter(user.getEmail());
				estimateRepository.deleteAll(estimates);
				List<Payment> payments = paymentRepository.findAllByUserEmail(user.getEmail());
				paymentRepository.deleteAll(payments);
				List<Review> reviews = reviewRepository.findAllByUserEmail(user.getEmail());
				reviewRepository.deleteAll(reviews);
				List<Comment> comments = commentRepository.findAllByCommentWriterEmail(user.getEmail());
				commentRepository.deleteAll(comments);
				List<Qna> qnas = qnaRepository.findAllByQnaWriter(user.getEmail());
				qnaRepository.deleteAll(qnas);
				MypageAdmin adminInfo = mypageAdminRepository.findByUserEmail(user.getEmail());
				mypageAdminRepository.delete(adminInfo);
        userRepository.delete(user);
    } else {
        throw new EntityNotFoundException("User with email not found.");
    }
	}
	
	
}
