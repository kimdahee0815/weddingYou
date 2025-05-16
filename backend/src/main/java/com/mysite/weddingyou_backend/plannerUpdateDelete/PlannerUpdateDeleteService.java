package com.mysite.weddingyou_backend.plannerUpdateDelete;

import java.util.ArrayList;
import java.util.List;

import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
import jakarta.transaction.Transactional;


@Service
@Transactional
public class PlannerUpdateDeleteService {
	 
	@Autowired
	private PlannerUpdateDeleteRepository plannerRepository;

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
	
	public PlannerUpdateDelete getPlannerByEmail(String email) {
		//System.out.println(plannerRepository.findByEmail(email));
        return plannerRepository.findByEmail(email);
    }
	
	public void save(PlannerUpdateDelete planner) {
		//repository의 save 메소드 소환
		plannerRepository.save(planner);
		// repository의 save 메서드 호출(조건. entity 객체를 넘겨줘야 함)
	}
	
	public void delete(PlannerUpdateDelete planner) throws ParseException { 
    List<LikeEntity> likes = likeRepository.findByPlannerEmail(planner.getEmail());
    likeRepository.deleteAll(likes);
		List<Estimate> allEstimates = estimateRepository.findAllByOrderByIdDesc();
		JSONParser parser = new JSONParser();
		for(Estimate estimate: allEstimates){
			ArrayList<String> plannerMatching = (ArrayList<String>) parser.parse(estimate.getPlannermatching());
			if(plannerMatching.contains(planner.getEmail())){
				plannerMatching.remove(planner.getEmail());
				estimate.setPlannermatching(plannerMatching.toString());
			}
			ArrayList<String> userMatching = (ArrayList<String>) parser.parse(estimate.getUserMatching());
			if(userMatching.contains(planner.getEmail())){
				userMatching.remove(planner.getEmail());
				estimate.setUserMatching(userMatching.toString());
			}
			estimateRepository.save(estimate);
		}
		// List<Payment> payments = paymentRepository.findAllByPlannerEmail(planner.getEmail());
		// paymentRepository.deleteAll(payments);
		List<Review> reviews = reviewRepository.findAllByPlannerEmail(planner.getEmail());
		reviewRepository.deleteAll(reviews);
		List<Comment> comments = commentRepository.findAllByCommentEmail(planner.getEmail());
		commentRepository.deleteAll(comments);
		List<Qna> qnas = qnaRepository.findAllByQnaWriter(planner.getEmail());
		qnaRepository.deleteAll(qnas);
		MypageAdmin adminInfo = mypageAdminRepository.findByPlannerEmail(planner.getEmail());
		mypageAdminRepository.delete(adminInfo);
    plannerRepository.delete(planner);
  }
}
