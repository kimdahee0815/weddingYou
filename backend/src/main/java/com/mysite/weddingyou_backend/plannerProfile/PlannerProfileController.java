package com.mysite.weddingyou_backend.plannerProfile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mysite.weddingyou_backend.estimate.Estimate;
import com.mysite.weddingyou_backend.estimate.EstimateRepository;
import com.mysite.weddingyou_backend.estimate.EstimateService;
import com.mysite.weddingyou_backend.payment.Payment;
import com.mysite.weddingyou_backend.payment.PaymentRepository;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDelete;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDeleteRepository;
import com.mysite.weddingyou_backend.review.Review;
import com.mysite.weddingyou_backend.review.ReviewRepository;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDelete;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDeleteRepository;

@RestController
public class PlannerProfileController {
    private final PlannerProfileService plannerService;
    
    @Autowired
    private PlannerUpdateDeleteRepository plannerUpdateDeleteRepository;
    
    @Autowired
    private UserUpdateDeleteRepository userUpdateDeleteRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private EstimateRepository estimateRepository;
    
    @Autowired
    private EstimateService estimateService;
    

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    public PlannerProfileController(PlannerProfileService plannerService) {
        this.plannerService = plannerService;
    }

    @PostMapping("/plannerProfile/getProfile")
    public List<PlannerProfile> getPlannerProfile() {
       return plannerService.getPlannerProfiles();
    }
    
    @PostMapping("/plannerProfile/getProfiles1")
    public List<PlannerProfile> saveAndGetPlannerProfiles() throws ParseException {
      List<PlannerUpdateDelete> plannersInfo =  plannerUpdateDeleteRepository.findAll();
     
      for(int i =0;i<plannersInfo.size();i++) {
    	  PlannerProfile newProfile = new PlannerProfile();
    	  String plannerEmail = plannersInfo.get(i).getEmail();
    	  String plannerName  = plannersInfo.get(i).getName();
    	  String plannerIntroduction = plannersInfo.get(i).getIntroduction();
    	  String plannerPhoneNum = plannersInfo.get(i).getPhoneNum();
    	  String plannerImg = plannersInfo.get(i).getPlannerImg();
    	  LocalDateTime plannerJoinDate = plannersInfo.get(i).getPlannerJoinDate();
    	  int plannerCareerYears = Integer.parseInt(plannersInfo.get(i).getPlannerCareerYears());
    	  
    	  List<Review> reviews = new ArrayList<>();
    	  System.out.println(plannerEmail);
    	  reviews = reviewRepository.findAllByPlannerEmail(plannerEmail);

    	  ArrayList<String> reviewUsers = new ArrayList<>();
    	  ArrayList<Integer> reviewStars = new ArrayList<>();
    	  int totalReviewStars = 0;
    	  int reviewCount = 0;
    	  if(reviews!=null) {
    		  for(int j = 0;j<reviews.size();j++) {
    			  System.out.println(reviews.get(j).getPlannerEmail());
        		  reviewUsers.add(reviews.get(j).getUserEmail());
        		  reviewStars.add(reviews.get(j).getReviewStars());
        		  totalReviewStars += reviews.get(j).getReviewStars();
        	  }
    		  reviewCount = reviews.size();
    	  }  
    	  
    	  double avgReviewStars = 0.0;
    	  if(reviewCount !=0) {
    		  avgReviewStars =  Math.round(totalReviewStars / (double)reviewCount * 100.0)/100.0;
    	  }
    	  
    	  String avgReviewStarsStr = String.valueOf(avgReviewStars);
    	  
    	  List<Estimate> estimates = estimateRepository.findAll();
    	  int matchingCount = 0;
    	  for(int k = 0;k<estimates.size();k++) {
    		  Estimate targetEstimate = estimates.get(k);
    		  if(targetEstimate.isMatchstatus()) {
    			  JSONParser parser = new JSONParser();
    			  ArrayList<String> matchedPlanners = (ArrayList<String>) parser.parse(targetEstimate.getPlannermatching());
    			  if(matchedPlanners.contains(plannerEmail)) {
    				  matchingCount += 1;
    			  }
    			 
    		  }
    	  }
    	  
    	  if(plannerService.getPlannerByEmail(plannerEmail)==null) {
    		  newProfile.setPlannerEmail(plannerEmail);
        	  newProfile.setPlannerName(plannerName);
        	  newProfile.setIntroduction(plannerIntroduction);
        	  newProfile.setPlannerPhoneNum(plannerPhoneNum);
        	  newProfile.setPlannerProfileImg(plannerImg);
        	  newProfile.setPlannerJoinDate(plannerJoinDate);
        	  newProfile.setPlannerCareerYears(plannerCareerYears);
        	  newProfile.setReviewCount(reviewCount);
        	  newProfile.setReviewStars(String.valueOf(reviewStars));
        	  newProfile.setReviewUsers(String.valueOf(reviewUsers));
        	  newProfile.setMatchingCount(matchingCount);
        	  newProfile.setAvgReviewStars(avgReviewStarsStr);
        	  
        	  plannerService.save(newProfile);
    	  }else {
    		  PlannerProfile targetProfile = plannerService.getPlannerByEmail(plannerEmail);
    		  
    		  targetProfile.setPlannerEmail(plannerEmail);
    		  targetProfile.setPlannerName(plannerName);
    		  targetProfile.setIntroduction(plannerIntroduction);
    		  targetProfile.setPlannerPhoneNum(plannerPhoneNum);
    		  targetProfile.setPlannerProfileImg(plannerImg);
    		  targetProfile.setPlannerJoinDate(plannerJoinDate);
    		  targetProfile.setPlannerCareerYears(plannerCareerYears);
    		  targetProfile.setReviewCount(reviewCount);
        	  targetProfile.setReviewStars(String.valueOf(reviewStars));
        	  targetProfile.setReviewUsers(String.valueOf(reviewUsers));
        	  targetProfile.setMatchingCount(matchingCount);
        	  targetProfile.setAvgReviewStars(avgReviewStarsStr);
        	  
        	  plannerService.save(targetProfile);
    	  }
    	  
      }
      
      List<PlannerProfile> foundPlannersInfo = plannerService.getPlannerProfiles();
      return foundPlannersInfo;
    }
    
    @PostMapping("/plannerProfile/getProfiles2")
    public List<String> getPlannerProfiles2() throws ParseException {
    	List<PlannerUpdateDelete> plannersInfo =  plannerUpdateDeleteRepository.findAll();
    	 List<String> encodingDatas = new ArrayList<>();
    	 
    	for(int i =0;i<plannersInfo.size();i++) {
    		PlannerUpdateDelete targetPlanner = plannerUpdateDeleteRepository.findByEmail(plannersInfo.get(i).getEmail());
    		
    		if(targetPlanner.getPlannerImg()!=null) {
    			String path = "C:/Project/profileImg/planner";
   	    	 Path imagePath = Paths.get(path,targetPlanner.getPlannerImg());
   	    	 System.out.println(imagePath);

   	         try {
   	             byte[] imageBytes = Files.readAllBytes(imagePath);
   	             byte[] base64encodedData = Base64.getEncoder().encode(imageBytes);
   	             
   	             encodingDatas.add(new String(base64encodedData));
   	             
   	         } catch (IOException e) {
   	             e.printStackTrace();
   	            
   	         }
    		}else {
    			 encodingDatas.add("null");
    		}
    		
	        encodingDatas.add(targetPlanner.getName());
	        encodingDatas.add(targetPlanner.getEmail());
    	}
    	
       
    		
	    	 
	        return encodingDatas;
    
    }
    
    @PostMapping("/plannerProfile/getProfiles3")
    public List<String> getPlannerProfiles3(@RequestParam("plannerEmailArr") String plannerEmailSort) throws ParseException {
    	System.out.println(plannerEmailSort);
    	JSONParser parser = new JSONParser();
		ArrayList<String> obj = (ArrayList<String>) parser.parse(plannerEmailSort);
		System.out.println(obj);
		 List<String> encodingDatas = new ArrayList<>();
		for(int i =0;i<obj.size();i++) {
			PlannerUpdateDelete targetPlanner =  plannerUpdateDeleteRepository.findByEmail(obj.get(i));
	    	 	 
	    		if(targetPlanner.getPlannerImg()!=null) {
	    			String path = "C:/Project/profileImg/planner";
	   	    	 Path imagePath = Paths.get(path,targetPlanner.getPlannerImg());
	   	    	 System.out.println(imagePath);

	   	         try {
	   	             byte[] imageBytes = Files.readAllBytes(imagePath);
	   	             byte[] base64encodedData = Base64.getEncoder().encode(imageBytes);
	   	             
	   	             encodingDatas.add(new String(base64encodedData));
	   	             
	   	         } catch (IOException e) {
	   	             e.printStackTrace();
	   	            
	   	         }
	    		}else {
	    			 encodingDatas.add("null");
	    		}
	    		
		        encodingDatas.add(targetPlanner.getName());
		        encodingDatas.add(targetPlanner.getEmail());
	    	
		    	 
		      
		}
		  return encodingDatas;
    
    }
    
    @PostMapping("/plannerProfile/getProfileDetail")
    public List<String> getProfileDetail(@RequestParam("plannerEmail") String plannerEmail) throws ParseException {
    	PlannerProfile targetPlannerProfile = plannerService.getPlannerByEmail(plannerEmail);
    	 List<String> result = new ArrayList<>();
    	 List<Review> reviewData = reviewRepository.findAllByPlannerEmail(plannerEmail);
    	result.add(String.valueOf(targetPlannerProfile.getReviewCount()));
    	result.add(String.valueOf(targetPlannerProfile.getAvgReviewStars()));	
    	result.add(String.valueOf(targetPlannerProfile.getIntroduction()));
    	result.add(String.valueOf(targetPlannerProfile.getMatchingCount()));
    	result.add(String.valueOf(targetPlannerProfile.getPlannerPhoneNum()));
   
    	if(!targetPlannerProfile.getReviewUsers().equals("[]")) {
    		String data = targetPlannerProfile.getReviewUsers().substring(1, targetPlannerProfile.getReviewUsers().length()-1);
        	String[] reviewUsers = data.split(",");
        
    		ArrayList<String> userName = new ArrayList<>();
    		ArrayList<String> userReview = new ArrayList<>();
        	for(int i=0;i<reviewUsers.length;i++) {
        		System.out.println(reviewUsers[i].trim());
        		UserUpdateDelete userInfo = userUpdateDeleteRepository.findByEmail(reviewUsers[i].trim());
        		System.out.println(userInfo.getName());
        		userName.add(userInfo.getName());
        		userReview.add(reviewData.get(i).getReviewText());
        	}
        	result.add(String.valueOf(userName));
        	result.add(String.valueOf(userReview));
        }else {
    		result.add("[]");
    		result.add("[]");
    	}
    	
//    	result.add(String.valueOf(targetPlannerProfile.getReviewUsers()));
    	result.add(String.valueOf(targetPlannerProfile.getReviewStars()));
    	result.add(String.valueOf(targetPlannerProfile.getPlannerCareerYears()));
    	
	    return result;
    
    }
    
    @PostMapping("/plannerProfile/getProfileDetail2")
    public List<String> getProfileDetail2(@RequestParam("userEmail") String userEmail,@RequestParam("estimateNum") String estimateNum ) throws ParseException {
    	List<Estimate> estimatesData = estimateRepository.findAllByWriter(userEmail);
    	String searchedPlanner = "";
    	List<String> encodingDatas = new ArrayList<>();
    	for(int i =0;i<estimatesData.size();i++) {
    		if(i==Integer.parseInt(estimateNum)) {
    			JSONParser parser = new JSONParser();
    			ArrayList<String> plannerMatching = (ArrayList<String>) parser.parse(estimatesData.get(i).getPlannermatching());
    			searchedPlanner = plannerMatching.get(0);
    			
    			break;
    		}
    	}
    	PlannerUpdateDelete targetPlanner = plannerUpdateDeleteRepository.findByEmail(searchedPlanner);
    	if(targetPlanner.getPlannerImg()!=null) {
			String path = "C:/Project/profileImg/planner";
	    	 Path imagePath = Paths.get(path,targetPlanner.getPlannerImg());
	    	 System.out.println(imagePath);

	         try {
	             byte[] imageBytes = Files.readAllBytes(imagePath);
	             byte[] base64encodedData = Base64.getEncoder().encode(imageBytes);
	             
	             encodingDatas.add(new String(base64encodedData));
	             
	         } catch (IOException e) {
	             e.printStackTrace();
	            
	         }
		}else {
			 encodingDatas.add("null");
		}
		
        encodingDatas.add(targetPlanner.getName());
        encodingDatas.add(targetPlanner.getEmail());
        return encodingDatas;
       
    }
    
    @PostMapping("/plannerProfile/getUnmatchedEstimates")
    public List<String> getUnmatchedEstimates(@RequestParam("userEmail") String userEmail ) throws ParseException {
    	List<Estimate> estimatesData = estimateRepository.findAllByWriter(userEmail);
    	
    	List<String> result = new ArrayList<>();
    	for(int i =0;i<estimatesData.size();i++) {
    		if(!estimatesData.get(i).isMatchstatus()) {
    			result.add(String.valueOf(estimatesData.get(i).getId()));
    		}
    	}
    
        return result;
       
    }
    
  //견적서 매칭원하는 고객 삽입하기
  		@PostMapping(value = "/plannerProfile/insert/matchingUser")
  		public void updateData(
  		                       @RequestParam("estimateId") Long estimateId,
  								@RequestParam("usermatching") String usermatching)
  		                    		   throws Exception {
  		    
  			Estimate targetData = estimateService.getEstimateDetail(estimateId);
  			
  			
  			System.out.println("targetData.plannermatching:"+targetData.getUserMatching());
  			JSONParser parser = new JSONParser();
  			ArrayList<String> obj = (ArrayList<String>) parser.parse(usermatching);
  			ArrayList<String> userList = null;
  			if(targetData.getUserMatching()!=null) {
  				userList = (ArrayList<String>) parser.parse(targetData.getUserMatching());
  				System.out.println(userList);
  			}else {
  				userList = new ArrayList<>();
  			}
  			 
  			
  			if(userList.size() == 0) {
  				Estimate data = new Estimate();
  				data.setUserMatching(usermatching);
  				targetData.setUserMatching(data.getUserMatching());
  				
  				estimateService.save(targetData);
  			}
  			else if(userList.size()!=0 && !userList.containsAll(obj)) {
  				Estimate data = new Estimate();
  				data.setUserMatching(usermatching);
  				targetData.setUserMatching(data.getUserMatching());
  				
  				estimateService.save(targetData);
  			}else if(userList.size()!=0  && userList.containsAll(obj)){
  				throw new Exception("중복됩니다!");
  			}
  			
  		}
  		
  	//매칭 요청 온 고객 출력하기
  		@PostMapping(value = "/plannerProfile/getmatchingUser")
  		public List<String> getmatchingUser(
  		                       @RequestParam("plannerEmail") String plannerEmail)
  								
  		                    		   throws Exception {
  		    
  			List<Estimate> estimatesData = estimateRepository.findAll();
  			ArrayList<String> result = new ArrayList<>();
  			if(estimatesData!=null) {
  				
  	  			for(int i =0;i<estimatesData.size();i++) {
  	  				Estimate targetEstimate  = estimatesData.get(i);
  	  				JSONParser parser = new JSONParser();
  	  	  			ArrayList<String> obj = null; 
  	  	  			if(targetEstimate.getUserMatching()==null) {
  	  	  				obj= new ArrayList<>();
  	  	  			}else {
  	  	  				obj = (ArrayList<String>) parser.parse(targetEstimate.getUserMatching());
  	  	  				
  	  	  			}
  	  				for(int j = 0;j<obj.size();j++) {
  	  					if(obj.get(j).equals(plannerEmail)) {
  	  						String userEmail = targetEstimate.getWriter();
  	  						UserUpdateDelete userInfo = userUpdateDeleteRepository.findByEmail(userEmail);
  	  						
  	  						result.add(userInfo.getName());
  	  						result.add(userEmail);
  	  						result.add(String.valueOf(targetEstimate.getId()));
  	  						
  	  						break;
  	  					}
  	  				}
  	  			}
  			}
  			
  			
  			return result;
  		}
  			
  	//매칭 요청 온 고객 취소하기
  		@PostMapping(value = "/plannerProfile/cancelMatchingUser")
  		public int cancelMatchingUser(
  		                       @RequestParam("estimateId") Long estimateId, @RequestParam("plannerEmail") String plannerEmail)
  								
  		                    		   throws Exception {
  		    
  			Estimate targetEstimate = estimateRepository.findById(estimateId);
  			int res = 0;
  			if(targetEstimate!=null) {
  				
  	  				JSONParser parser = new JSONParser();
  	  	  			ArrayList<String> obj = null; 
  	  	  			if(targetEstimate.getUserMatching()==null) {
  	  	  				obj= new ArrayList<>();
  	  	  			}else {
  	  	  				obj = (ArrayList<String>) parser.parse(targetEstimate.getUserMatching());
  	  	  				obj.remove(plannerEmail);
  	  	  				targetEstimate.setUserMatching(String.valueOf(obj));
  	  	  				if(targetEstimate.isMatchstatus()) {
  	  	  					obj = (ArrayList<String>) parser.parse(targetEstimate.getPlannermatching());
  	  	  					obj.remove(plannerEmail);
  	  	  					targetEstimate.setPlannermatching(String.valueOf(obj));
  	  	  					targetEstimate.setMatchstatus(false);
  	  	  					Payment targetPayment = paymentRepository.findByEstimateId(estimateId);
  	  	  					if(targetPayment!=null) {
  	  	  						paymentRepository.delete(targetPayment);
  	  	  					}
  	  	  				}
  	  	  				estimateRepository.save(targetEstimate);
  	  	  				res =1;
  	  	  			}		
  	  			}
  			
  			return res;
  			
  			
  		}
  	//매칭 요청 온 고객 매칭하기
  		@PostMapping(value = "/plannerProfile/matchingUser")
  		public int matchingUser(
  		                       @RequestParam("estimateId") Long estimateId, @RequestParam("plannerEmail") String plannerEmail)
  								
  		                    		   throws Exception {
  		    
  			Estimate targetEstimate = estimateRepository.findById(estimateId);
  			int res = 0;
  			if(targetEstimate!=null) {
  				
  	  				JSONParser parser = new JSONParser();
  	  	  			ArrayList<String> obj = null; 
  	  	  			if(targetEstimate.getUserMatching()==null) {
  	  	  				obj= new ArrayList<>();
  	  	  			}else {
  	  	  				obj = (ArrayList<String>) parser.parse(targetEstimate.getUserMatching());
  	  	  				System.out.println(obj);
  	  	  			
  	  	  				obj.clear();
  	  	  				obj.add(plannerEmail);
  	  	  				targetEstimate.setUserMatching(String.valueOf(obj));
  	  	  				targetEstimate.setPlannermatching(String.valueOf(obj));
  	  	  				targetEstimate.setMatchstatus(true);
  	  	  				estimateRepository.save(targetEstimate);
  	  	  				res =1;
  	  	  			}		
  	  			}
  			
  			return res;
  			
  			
  		}
 
  		//매칭된 고객 정보 가져오기
  		@PostMapping(value = "/plannerProfile/getMatchedUser")
  		public List<String> getMatchedUser(
  		                       @RequestParam("plannerEmail") String plannerEmail)
  								
  		                    		   throws Exception {
  		    List<String> result = new ArrayList<>();
  			List<Estimate> estimatesData = estimateRepository.findAll();
  			int k = 0;
  			if(estimatesData !=null) {
  				for(int i =0;i<estimatesData.size();i++) {
  					Estimate targetEstimate = estimatesData.get(i);
  					JSONParser parser = new JSONParser();
  					ArrayList<String> obj = null;
  					if(targetEstimate.getUserMatching()!=null) {
  						obj = (ArrayList<String>) parser.parse(targetEstimate.getUserMatching()); 
  					}else {
  						obj = new ArrayList<>();
  					}
  					if(obj.contains(plannerEmail)) {
  						k++;
  					}
  					if(targetEstimate.isMatchstatus() && obj.contains(plannerEmail)) {
  						
  						result.add(String.valueOf(targetEstimate.getId()));
  						String userEmail = targetEstimate.getWriter();
  						UserUpdateDelete userInfo = userUpdateDeleteRepository.findByEmail(userEmail);
  						String userName = userInfo.getName();
  						result.add(userName);
  						result.add(String.valueOf(k));  
  						
  					}
  				}
  			}
  		
  			
  			return result;
  			
  			
  		}

  		
}
