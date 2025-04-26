package com.mysite.weddingyou_backend.review;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mysite.weddingyou_backend.estimate.Estimate;
import com.mysite.weddingyou_backend.estimate.EstimateRepository;
import com.mysite.weddingyou_backend.payment.Payment;
import com.mysite.weddingyou_backend.payment.PaymentRepository;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDelete;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDeleteRepository;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDelete;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDeleteRepository;

import jakarta.transaction.Transactional;


@RestController

public class ReviewController {
	
	@Autowired
	ReviewService reviewService;
	
	@Autowired
	PlannerUpdateDeleteRepository plannerUpdateDeleteRepository;
	
	@Autowired
	UserUpdateDeleteRepository userUpdateDeleteRepository;
	
	@Autowired
	ReviewRepository reviewRepository;
	
	@Autowired
	EstimateRepository estimateRepository;
	
	@Autowired
	PaymentRepository paymentRepository;
	
	@Value("${spring.servlet.multipart.location}")
    String uploadDir;
	
	@PostMapping(value = "/reviews")
	public int createReview(@RequestParam("reviewText") String reviewText,
	        @RequestParam("reviewStars") Integer reviewStars,
	        @RequestParam(value = "reviewImg", required = false) MultipartFile[] reviewImg,
	        @RequestParam("userEmail") String userEmail,
	        @RequestParam("plannerEmail") String plannerEmail,
	        @RequestParam("estimateId") Long estimateId) throws IOException {
		
		int res = 0;
	    
	    // 파일 저장
		List<String> list = new ArrayList<>();
	 	if (!(reviewImg == null)) {
	 	for (MultipartFile file : reviewImg) {
	 		if (!file.isEmpty()) {
	 			File storedFilename = new File(UUID.randomUUID().toString() + "_" + file.getOriginalFilename());
	 			list.add("\"" + storedFilename.toString() + "\"");
                file.transferTo(storedFilename); //업로드
	 		}
	 	}
	 	}
	 	
	 	Review review = new Review();
	 	if(reviewText.equals("undefined")) {
	 		review.setReviewText("");
	 	}else {
	 		review.setReviewText(reviewText);
	 	}
	 	
	 	review.setReviewStars(reviewStars);
	 	review.setReviewImg(list.toString());
	 	review.setUserEmail(userEmail);
	 	review.setPlannerEmail(plannerEmail);
	 	review.setReviewDate(LocalDateTime.now());
	 	review.setEstimateId(estimateId);
	 	PlannerUpdateDelete plannerData = plannerUpdateDeleteRepository.findByEmail(plannerEmail);
	 	review.setReviewTitle(plannerData.getName()+" 플래너 Review");
	 	review.setReviewCounts(0);
	 	System.out.println(review);
	 	
	 	if(reviewService.findEstimate(estimateId)!=null) {
	 		Review targetReview = reviewService.findEstimate(estimateId);
	 		targetReview.setPlannerEmail(plannerEmail);
	 		targetReview.setReviewText(reviewText);
	 		targetReview.setReviewStars(reviewStars);
	 		targetReview.setReviewImg(list.toString());
	 		targetReview.setUserEmail(userEmail);
	 		targetReview.setReviewDate(LocalDateTime.now());
	 		reviewService.save(targetReview);
	 		res =1;
	 	}else {
	 	// 리뷰 생성 및 데이터베이스 저장
		    reviewService.save(review);
		    res=1;
	 	}
	 	
	 	
	    
	    
	    return res;
	    
	}
	
	@RequestMapping(value = "/getreviewslist")
	public List<Review> getReviews() {
		
		List<Review> reviewList = reviewService.getReviewList();
		return reviewList;
 
	    
	}
	
	@GetMapping(value="/estimateIdReview/{estimateId}")
	public Review getReviewByEstimateId(@PathVariable Long estimateId) {
		
		Review targetReview  = reviewService.findEstimate(estimateId);
		if(targetReview ==null) {
			
		}
		return targetReview;
	}
	
	@PutMapping(value="/reviewcount/{estimateId}")
	public Review addReviewCount(@PathVariable Long estimateId) {
		
		Review targetReview  = reviewService.findEstimate(estimateId);
		if(targetReview !=null) {
			int reviewCount = targetReview.getReviewCounts();
			targetReview.setReviewCounts(reviewCount+1);
			reviewRepository.save(targetReview);
		}
		return targetReview;
	}
	
	
	@RequestMapping("/review/imageview")
    public ResponseEntity<UrlResource> downloadReviewImg(@RequestParam("image") String stored) throws MalformedURLException {
        UrlResource resource = new UrlResource("file:" + uploadDir + "/" + stored);
        return ResponseEntity.ok().body(resource);
    }

	@Transactional
	@DeleteMapping("/review/delete/{estimateId}")
    public Review removeReview(@PathVariable Long estimateId)  {
		Review targetReview  = reviewService.findEstimate(estimateId);
		if(targetReview !=null) {
			reviewRepository.deleteByEstimateId(estimateId);
		}
		return targetReview;
    }
	
	@PostMapping(value = "/updatedreviews")
	public int updateReview(@RequestParam("reviewText") String reviewText,
			@RequestParam("reviewTitle") String reviewTitle,
	        @RequestParam("reviewStars") Integer reviewStars,
	        @RequestParam(value = "reviewImg", required = false) MultipartFile[] reviewImg,
	        @RequestParam("userEmail") String userEmail,
	        @RequestParam("plannerEmail") String plannerEmail,
	        @RequestParam("estimateId") Long estimateId) throws IOException {
		
		int res = 0;
	    
	    // 파일 저장
		List<String> list = new ArrayList<>();
	 	if (!(reviewImg == null)) {
	 	for (MultipartFile file : reviewImg) {
	 		if (!file.isEmpty()) {
	 			File storedFilename = new File(UUID.randomUUID().toString() + "_" + file.getOriginalFilename());
	 			list.add("\"" + storedFilename.toString() + "\"");
                file.transferTo(storedFilename); //업로드
	 		}
	 	}
	 	}
	 	
	 	Review review = new Review();
	 	if(reviewText.equals("undefined")) {
	 		review.setReviewText("");
	 	}else {
	 		review.setReviewText(reviewText);
	 	}
	 	
	 	review.setReviewStars(reviewStars);
	 	review.setReviewImg(list.toString());
	 	review.setUserEmail(userEmail);
	 	review.setPlannerEmail(plannerEmail);
	 	review.setReviewDate(LocalDateTime.now());
	 	review.setReviewTitle(reviewTitle);
	 	review.setEstimateId(estimateId);
	 	PlannerUpdateDelete plannerData = plannerUpdateDeleteRepository.findByEmail(plannerEmail);
	 	review.setReviewTitle(plannerData.getName()+"플래너 Review");
	 	review.setReviewCounts(0);
	 	System.out.println(review);
	 	
	 	if(reviewService.findEstimate(estimateId)!=null) {
	 		Review targetReview = reviewService.findEstimate(estimateId);
	 		targetReview.setPlannerEmail(plannerEmail);
	 		targetReview.setReviewText(reviewText);
	 		targetReview.setReviewStars(reviewStars);
	 		targetReview.setReviewImg(list.toString());
	 		targetReview.setUserEmail(userEmail);
	 		targetReview.setReviewDate(LocalDateTime.now());
	 		targetReview.setReviewTitle(reviewTitle);
	 		reviewService.save(targetReview);
	 		res =1;
	 	}else {
	 	// 리뷰 생성 및 데이터베이스 저장
		    reviewService.save(review);
		    res=1;
	 	}
	 	
	 	
	    
	    
	    return res;
	    
	}
	
	@PostMapping(value = "/reviewauthority/{estimateId}")
	public int checkUpdateDeleteAuthorityReview(
	        @RequestParam("userEmail") String userEmail,
	        @PathVariable("estimateId") Long estimateId) throws IOException {
		int res =0;
		Review targetReview  = reviewService.findEstimate(estimateId);
		if(targetReview !=null) {
			if(targetReview.getUserEmail().equals(userEmail)) {
				res =1;
			}else {
				res =0;
			}
		}
		return res;
	    
	}
	
	@PostMapping(value = "/existreviewpaid")
	public List<String> checkPaidReview(
	        @RequestParam("userEmail") String userEmail
	        ) throws IOException {
		int res =0;
		List<Estimate> estimatesData = estimateRepository.findAllByWriter(userEmail);
		List<String> result = new ArrayList<>();
    	
       
		for(int i =0;i<estimatesData.size();i++) {
			Estimate targetEstimate = estimatesData.get(i);
			Long estimateId = targetEstimate.getId();
			Payment paymentData = paymentRepository.findByEstimateId(estimateId);
			if(paymentData!=null) {
				if(paymentData.getPaymentStatus().equals("paid")) {
					result.add(String.valueOf(estimateId));
				}
			}
			
		}
		 return result; 
	    
	}
	
	@PostMapping(value = "/plannerinforeview")
	public String getPlannerInfoForReview2(
			@RequestParam("targetEstimateId") Long estimateId
			) throws Exception {
	    String result="";
	    
		Estimate targetEstimate = estimateRepository.findById(estimateId);
		JSONParser parser = new JSONParser();
		
		ArrayList<String> plannermatching = (ArrayList<String>) parser.parse(targetEstimate.getPlannermatching());
		String plannerEmail = plannermatching.get(0);
		//	UserUpdateDelete data = userUpdateDeleteRepository(userEmail);
		PlannerUpdateDelete plannerData = plannerUpdateDeleteRepository.findByEmail(plannerEmail);
		
//		System.out.println(data.getName());
//		String userName = data.getName()+"/";
//		result= userName;
//		System.out.println(data.getPhoneNum());
//		String userPhone = data.getPhoneNum()+"]";
//		result+= userPhone;

		String planneremail = plannerData.getEmail()+"[";
		result +=planneremail;
		String plannerName = plannerData.getName()+",";
		result+=plannerName;
//		String price = targetEstimate.getBudget()+"*";
//		result+=price;
	         
	    try {
	    	if(plannerData.getPlannerImg()!=null) {
	    		Path imagePath = Paths.get("C:/Project/profileImg/planner",plannerData.getPlannerImg());
		        byte[] imageBytes = Files.readAllBytes(imagePath);
		        byte[] base64encodedData = Base64.getEncoder().encode(imageBytes);
		        result += String.valueOf(new String(base64encodedData));
	    	}
	    	
	       
	    } catch (IOException e) {
	           e.printStackTrace();
	        
	    }
	    

		System.out.println("result"+result);
		return result;
	
	}
}