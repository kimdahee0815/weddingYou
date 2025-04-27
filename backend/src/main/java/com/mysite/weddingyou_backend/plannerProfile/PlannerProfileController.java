package com.mysite.weddingyou_backend.plannerProfile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    
  @GetMapping("/plannerProfiles/{sort}")
	public List<PlannerProfile> saveAndGetPlannerProfiles(@PathVariable String sort) throws ParseException {
    List<PlannerUpdateDelete> plannersInfo = plannerUpdateDeleteRepository.findAll();

    // planner profile save or update
    for (PlannerUpdateDelete plannerInfo : plannersInfo) {
        PlannerProfileDTO newProfile = createOrUpdatePlannerProfile(plannerInfo);
				plannerService.save(newProfile);
    }

    List<PlannerProfile> foundPlannersInfo = plannerService.getPlannerProfiles();

    // sort
    return sortProfiles(foundPlannersInfo, sort);
	}

	// planner profile create or update
	private PlannerProfileDTO createOrUpdatePlannerProfile(PlannerUpdateDelete plannerInfo) throws ParseException {
    PlannerProfileDTO existingProfile = plannerService.getPlannerByEmail(plannerInfo.getEmail());
		PlannerProfileDTO profile = null;
		if(existingProfile == null) {
			profile = new PlannerProfileDTO();
		}else{
			profile = existingProfile;
		}
    String plannerEmail = plannerInfo.getEmail();
    List<Review> reviews = reviewRepository.findAllByPlannerEmail(plannerEmail);
    List<Estimate> estimates = estimateRepository.findAll();

    // Review stats and counts
    ReviewStats reviewStats = calculateReviewStats(reviews);
    int matchingCount = calculateMatchingCount(estimates, plannerEmail);

    profile.setPlannerEmail(plannerEmail);
    profile.setPlannerName(plannerInfo.getName());
    profile.setIntroduction(plannerInfo.getIntroduction());
    profile.setPhoneNum(plannerInfo.getPhoneNum());
    profile.setPlannerProfileImg(plannerInfo.getPlannerImg());
    profile.setPlannerJoinDate(plannerInfo.getPlannerJoinDate());
    profile.setCareer(Integer.parseInt(plannerInfo.getPlannerCareerYears()));
    profile.setReviewCount(reviewStats.getReviewCount());
    profile.setReviewStars(reviewStats.getReviewStars());
    profile.setReviewUsers(reviewStats.getReviewUsers());
    profile.setMatchingCount(matchingCount);
    profile.setAvgReviewStars(reviewStats.getAvgReviewStars());

    return profile;
	}

	// calcualte reviews
	private ReviewStats calculateReviewStats(List<Review> reviews) {
    int totalReviewStars = 0;
    int reviewCount = 0;
    ArrayList<String> reviewUsers = new ArrayList<>();
    ArrayList<Integer> reviewStars = new ArrayList<>();

    if (reviews != null) {
        for (Review review : reviews) {
            reviewUsers.add(review.getUserEmail());
            reviewStars.add(review.getReviewStars());
            totalReviewStars += review.getReviewStars();
        }
        reviewCount = reviews.size();
    }

    double avgReviewStars = reviewCount > 0 ? Math.round(totalReviewStars / (double) reviewCount * 100.0) / 100.0 : 0.0;
    String avgReviewStarsStr = String.valueOf(avgReviewStars);

    return new ReviewStats(reviewCount, reviewStars.toString(), reviewUsers.toString(), avgReviewStarsStr);
	}

	// matching count
	private int calculateMatchingCount(List<Estimate> estimates, String plannerEmail) throws ParseException {
    int matchingCount = 0;
    for (Estimate estimate : estimates) {
        if (estimate.isMatchstatus()) {
            JSONParser parser = new JSONParser();
            ArrayList<String> matchedPlanners = (ArrayList<String>) parser.parse(estimate.getPlannermatching());
            if (matchedPlanners.contains(plannerEmail)) {
                matchingCount++;
            }
        }
    }
    return matchingCount;
	}

	// sort planner profile	
	private List<PlannerProfile> sortProfiles(List<PlannerProfile> profiles, String sort) {
    switch (sort) {
        case "별점 높은 순":
						profiles.sort(Comparator.comparingDouble(profile -> Double.parseDouble(((PlannerProfile) profile).getAvgReviewStars())).reversed());
            break;
        case "후기순":
            profiles.sort(Comparator.comparingInt(PlannerProfile::getReviewCount).reversed());
            break;
        case "경력순":
            profiles.sort(Comparator.comparingInt(PlannerProfile::getPlannerCareerYears).reversed());
            break;
        case "매칭순":
            profiles.sort(Comparator.comparingInt(PlannerProfile::getMatchingCount).reversed());
            break;
				case "최신순":
            profiles.sort(Comparator.comparing(PlannerProfile::getPlannerJoinDate).reversed());
            break;
        case "플래너 등록순":
            profiles.sort(Comparator.comparing(PlannerProfile::getPlannerJoinDate));
            break;
        default:
						profiles.sort(Comparator.comparing(PlannerProfile::getPlannerJoinDate));
            break;
    }
    return profiles;
	}

	// Review Stats Class
	public static class ReviewStats {
    private int reviewCount;
    private String reviewStars;
    private String reviewUsers;
    private String avgReviewStars;

    public ReviewStats(int reviewCount, String reviewStars, String reviewUsers, String avgReviewStars) {
        this.reviewCount = reviewCount;
        this.reviewStars = reviewStars;
        this.reviewUsers = reviewUsers;
        this.avgReviewStars = avgReviewStars;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public String getReviewStars() {
        return reviewStars;
    }

    public String getReviewUsers() {
        return reviewUsers;
    }

    public String getAvgReviewStars() {
        return avgReviewStars;
    }
	}
    
    @PostMapping("/plannerProfile/detail")
    public PlannerProfileDTO getProfileDetail(@RequestParam("plannerEmail") String plannerEmail) throws ParseException {
    	PlannerProfileDTO targetPlannerProfile = plannerService.getPlannerByEmail(plannerEmail);
//     	 List<String> result = new ArrayList<>();
//     	 List<Review> reviewData = reviewRepository.findAllByPlannerEmail(plannerEmail);
//     	result.add(String.valueOf(targetPlannerProfile.getReviewCount()));
//     	result.add(String.valueOf(targetPlannerProfile.getAvgReviewStars()));	
//     	result.add(String.valueOf(targetPlannerProfile.getIntroduction()));
//     	result.add(String.valueOf(targetPlannerProfile.getMatchingCount()));
//     	result.add(String.valueOf(targetPlannerProfile.getPlannerPhoneNum()));
   
//     	if(!targetPlannerProfile.getReviewUsers().equals("[]")) {
//     		String data = targetPlannerProfile.getReviewUsers().substring(1, targetPlannerProfile.getReviewUsers().length()-1);
//         	String[] reviewUsers = data.split(",");
        
//     		ArrayList<String> userName = new ArrayList<>();
//     		ArrayList<String> userReview = new ArrayList<>();
//         	for(int i=0;i<reviewUsers.length;i++) {
//         		UserUpdateDelete userInfo = userUpdateDeleteRepository.findByEmail(reviewUsers[i].trim());
//         		userName.add(userInfo.getName());
//         		userReview.add(reviewData.get(i).getReviewText());
//         	}
//         	result.add(String.valueOf(userName));
//         	result.add(String.valueOf(userReview));
//         }else {
//     		result.add("[]");
//     		result.add("[]");
//     	}
    	
// //    	result.add(String.valueOf(targetPlannerProfile.getReviewUsers()));
//     	result.add(String.valueOf(targetPlannerProfile.getReviewStars()));
//     	result.add(String.valueOf(targetPlannerProfile.getPlannerCareerYears()));
    	
	    return targetPlannerProfile;
    
    }
    
    @PostMapping("/plannerProfile/getProfileDetail2")
    public PlannerUpdateDelete getProfileDetail2(@RequestParam("userEmail") String userEmail,@RequestParam("estimateNum") String estimateNum ) throws ParseException {
    	List<Estimate> estimatesData = estimateRepository.findAllByWriter(userEmail);
    	String searchedPlanner = "";

    	for(int i =0;i<estimatesData.size();i++) {
    		if(i==Integer.parseInt(estimateNum)) {
    			JSONParser parser = new JSONParser();
    			ArrayList<String> plannerMatching = (ArrayList<String>) parser.parse(estimatesData.get(i).getPlannermatching());
    			searchedPlanner = plannerMatching.get(0);
    			
    			break;
    		}
    	}
    	PlannerUpdateDelete targetPlanner = plannerUpdateDeleteRepository.findByEmail(searchedPlanner);
    	return targetPlanner;
       
    }
    
    @PostMapping("/plannerProfile/unmatched-estimates")
    public List<Estimate> getUnmatchedEstimates(@RequestParam("userEmail") String userEmail ) throws ParseException {
    	List<Estimate> estimatesData = estimateService.getUnmatchedEstimates(userEmail);
			List<Estimate> unmatchedEstimates = estimatesData.stream()
                                   .filter(e -> !e.isMatchstatus())
                                   .collect(Collectors.toList());
    
      return unmatchedEstimates;
    }
    
  //견적서 매칭원하는 고객 삽입하기
  		@PostMapping(value = "/plannerProfile/matching/users")
  		public void updateData(
  		                       @RequestParam("estimateId") Long estimateId,
  								@RequestParam("usermatching") String usermatching)
  		                    		   throws Exception {
  		    
  			Estimate targetData = estimateService.getEstimateDetail(estimateId);
  			JSONParser parser = new JSONParser();
  			ArrayList<String> obj = (ArrayList<String>) parser.parse(usermatching);
  			ArrayList<String> userList = null;
  			if(targetData.getUserMatching()!=null) {
  				userList = (ArrayList<String>) parser.parse(targetData.getUserMatching());
  			}else {
  				userList = new ArrayList<>();
  			}
  			 
  			if(userList.size()!=0  && userList.containsAll(obj)){
  				throw new Exception("중복됩니다!");
  			}else{
					Estimate data = new Estimate();
  				data.setUserMatching(usermatching);
  				targetData.setUserMatching(data.getUserMatching());
  				
  				estimateService.save(targetData);
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
