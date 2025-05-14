package com.mysite.weddingyou_backend.plannerProfile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mysite.weddingyou_backend.comment.Comment;
import com.mysite.weddingyou_backend.comment.CommentDTO;
import com.mysite.weddingyou_backend.estimate.Estimate;
import com.mysite.weddingyou_backend.estimate.EstimateRepository;
import com.mysite.weddingyou_backend.estimate.EstimateService;
import com.mysite.weddingyou_backend.payment.Payment;
import com.mysite.weddingyou_backend.payment.PaymentRepository;
import com.mysite.weddingyou_backend.payment.PaymentService;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLogin;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLoginRepository;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDelete;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDeleteRepository;
import com.mysite.weddingyou_backend.review.Review;
import com.mysite.weddingyou_backend.review.ReviewDTO;
import com.mysite.weddingyou_backend.review.ReviewRepository;
import com.mysite.weddingyou_backend.userLogin.UserLogin;
import com.mysite.weddingyou_backend.userLogin.UserLoginRepository;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDelete;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDeleteRepository;

import jakarta.transaction.Transactional;

@RestController
public class PlannerProfileController {
		@Autowired
    private final PlannerProfileService plannerService;
    
		@Autowired
    private final PaymentService paymentService;

    @Autowired
    private PlannerUpdateDeleteRepository plannerUpdateDeleteRepository;
    
		@Autowired
    private PlannerLoginRepository plannerLoginRepository;

    @Autowired
    private UserUpdateDeleteRepository userUpdateDeleteRepository;
    
		@Autowired
    private UserLoginRepository userLoginRepository;

    @Autowired
    private PlannerProfileService plannerProfileService;
    
    @Autowired
    private EstimateRepository estimateRepository;
    
    @Autowired
    private EstimateService estimateService;
    

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    public PlannerProfileController(PlannerProfileService plannerService, PaymentService paymentService) {
        this.plannerService = plannerService;
				this.paymentService = paymentService;
    }

    @PostMapping("/plannerProfile/getProfile")
    public List<PlannerProfile> getPlannerProfile() {
       return plannerService.getPlannerProfiles();
    }
    
  @GetMapping("/plannerProfiles/{sort}")
	public List<PlannerProfile> saveAndGetPlannerProfiles(@PathVariable String sort) throws ParseException {
    List<PlannerProfile> foundPlannersInfo = plannerService.getPlannerProfiles();

    // sort
    return sortProfiles(foundPlannersInfo, sort);
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
  			ArrayList<String> plannerList = (ArrayList<String>) parser.parse(targetData.getPlannermatching());

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
					System.out.println(obj.get(obj.size() - 1));
					System.out.println(plannerList.contains(obj.get(obj.size() - 1)));
					if(plannerList != null && plannerList.size() != 0 && plannerList.contains(obj.get(obj.size() - 1))){
						List<Payment> targetPayments = paymentRepository.findByEstimateId(estimateId);
					Payment targetPayment = targetPayments.stream()
					.filter(p -> p.getPlannerEmail().equals(obj.get(obj.size() - 1)) && p.getUserEmail().equals(targetData.getWriter())).findFirst().orElse(null);
					if(targetPayment == null){
						PlannerLogin planner = plannerLoginRepository.findByEmail(obj.get(obj.size() - 1));
      			UserLogin user = userLoginRepository.findByEmail(targetData.getWriter());

						BigDecimal depositAmount;
						int plannerCareerYears = Integer.parseInt(planner.getPlannerCareerYears());
      			if(plannerCareerYears >= 0 && plannerCareerYears <5) {
        			depositAmount = new BigDecimal(50000);
      			}else if(plannerCareerYears >= 5 && plannerCareerYears <15) {
        			depositAmount = new BigDecimal(100000);
      			}else {
        			depositAmount = new BigDecimal(150000);
      			}
						
						Payment payment = new Payment();
        		payment.setPrice(depositAmount);
        		payment.setQuantity(1);
        		payment.setPaymentMethod("card");
        		payment.setPaymentAmount(depositAmount);
        		payment.setPaymentStatus("other");
        		payment.setDepositAmount(depositAmount);
        		payment.setDepositStatus("other");
        		payment.setPaymentType("deposit");
        		payment.setUserEmail(targetData.getWriter());
        		payment.setPlannerEmail(obj.get(obj.size() - 1));
        		payment.setEstimateId(estimateId);
        		payment.setPaymentDate(null);
        		payment.setDepositDate(null);
        		payment.setPlanner(planner);
        		payment.setUser(user);
        		paymentService.savePayment(payment);
					}
					}
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
  	  	  					List<Payment> targetPayments = paymentRepository.findByEstimateId(estimateId);
  	  	  					Payment targetPayment = targetPayments.stream()
        															.filter(p -> p.getPlannerEmail().equals(plannerEmail))
        															.findFirst() 
        															.orElse(null); 
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
  		@PostMapping(value = "/plannerProfile/matching/user")
  		public int matchingUser(
  		  @RequestParam("estimateId") Long estimateId, @RequestParam("plannerEmail") String plannerEmail)
  								throws Exception {
  		    
  			Estimate targetEstimate = estimateRepository.findById(estimateId);
  			int res = 0;
  			if(targetEstimate!=null) { 				
  	  		JSONParser parser = new JSONParser();
  	  	  ArrayList<String> obj = null; 
  	  	  if(targetEstimate.getUserMatching()==null) {
  	  	  	obj = new ArrayList<>();
  	  	  }else {
  	  	  	obj = (ArrayList<String>) parser.parse(targetEstimate.getUserMatching());
  	  	  	obj.clear();
  	  	  	obj.add(plannerEmail);
  	  	  	targetEstimate.setUserMatching(String.valueOf(obj));
  	  	  	targetEstimate.setPlannermatching(String.valueOf(obj));
  	  	  	targetEstimate.setMatchstatus(true);
						PlannerUpdateDelete plannerInfo = plannerUpdateDeleteRepository.findByEmail(obj.get(0));
        		PlannerProfileDTO profile = PlannerProfileUtils.createOrUpdatePlannerProfile(plannerInfo);
        		plannerProfileService.save(profile);
  	  	  	estimateRepository.save(targetEstimate);
  	  	  	res =1;
  	  	  }		
  	  	}
  			
  			return res;
  			
  			
  		}
 
  		//매칭된 고객 정보 가져오기
  		@PostMapping(value = "/plannerProfile/match/users")
  		public List<Estimate> getMatchedUser(
  		                       @RequestParam("plannerEmail") String plannerEmail)
															throws Exception {
  		  List<Estimate> result = new ArrayList<>();
				JSONParser parser = new JSONParser();
  			List<Estimate> allEstimates = estimateService.getlist();
  			if(allEstimates !=null) {
					List<Estimate> targetEstimates = allEstimates.stream()
								.filter(e -> {
									try {
										if (e.getUserMatching() == null) {
												return false;
										}
										JSONArray userMatching = (JSONArray) parser.parse(e.getUserMatching());
										JSONArray plannerMatching = (JSONArray) parser.parse(e.getPlannermatching());
										ArrayList<String> plannerList = (ArrayList<String>) plannerMatching.stream()
    									.map(Object::toString)
    									.collect(Collectors.toList());
										ArrayList<String> userList = (ArrayList<String>) userMatching.stream()
    									.map(Object::toString)
    									.collect(Collectors.toList());
										ArrayList<PlannerProfileDTO> plannerProfiles = new ArrayList<PlannerProfileDTO> ();									
										if(plannerList.size() != 0){
												PlannerProfileDTO plannerData = plannerService.getPlannerByEmail(plannerEmail);
												plannerProfiles.add(plannerData);
												e.setPlannerProfiles(plannerProfiles);
											}
										return plannerList.contains(plannerEmail) && userList.contains(plannerEmail);
									} catch (Exception ex) {
										ex.printStackTrace();
										return false;
									}
								})
								.collect(Collectors.toList());
					return targetEstimates;
  			}
  			return result;
  		}

			//매칭된 고객 정보 가져오기
  		@PostMapping(value = "/plannerProfile/match/planners")
  		public List<Estimate> getMatchedPlannersEstimates(
  		                       @RequestParam("userEmail") String userEmail)
  		                    		   throws Exception {
				List<Estimate> allEstiamtes = new ArrayList<Estimate>();						
				JSONParser parser = new JSONParser();
  			List<Estimate> allEstimates = estimateService.getEstimateDetailByEmail(userEmail);
  			if(allEstimates !=null) {
					List<Estimate> targetEstimates = allEstimates.stream()
								.filter(e -> {
									try {
										if (e.getUserMatching() == null || e.getPlannermatching() == null) {
												return false;
										}
										JSONArray userMatching = (JSONArray) parser.parse(e.getUserMatching());
										JSONArray plannerMatching = (JSONArray) parser.parse(e.getPlannermatching());
										ArrayList<String> userList = (ArrayList<String>) plannerMatching.stream()
    									.map(Object::toString)
    									.collect(Collectors.toList());
										
										ArrayList<String> plannerList = (ArrayList<String>) userMatching.stream()
    									.map(Object::toString)
    									.collect(Collectors.toList());
		
										List<String> matchList = userList.stream()
            							.filter(plannerList::contains)
            							.collect(Collectors.toList());
										Set<String> mergedSet = new LinkedHashSet<>(userList);
										mergedSet.addAll(plannerList);

										int totalNumOfLists = userList.size() + plannerList.size();
										int totalNumOfMergedSet = mergedSet.size();

										Boolean result = (totalNumOfLists != totalNumOfMergedSet);
									
										ArrayList<PlannerProfileDTO> plannerProfiles = new ArrayList<PlannerProfileDTO> ();									
										if(result){
											matchList.forEach(matchPlanner -> {
												PlannerProfileDTO plannerData = plannerService.getPlannerByEmail(matchPlanner);
												plannerProfiles.add(plannerData);
											});
											e.setPlannerProfiles(plannerProfiles);
										}
										return result;
									} catch (Exception ex) {
										ex.printStackTrace();
										return false;
									}
								})
								.collect(Collectors.toList());
					return targetEstimates;
  			}
  			return allEstiamtes;
  		}
}
