package com.mysite.weddingyou_backend.payment;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mysite.weddingyou_backend.estimate.Estimate;
import com.mysite.weddingyou_backend.estimate.EstimateRepository;
import com.mysite.weddingyou_backend.estimate.EstimateService;
import com.mysite.weddingyou_backend.item.ItemRepository;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLogin;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLoginRepository;
import com.mysite.weddingyou_backend.plannerProfile.PlannerProfileDTO;
import com.mysite.weddingyou_backend.plannerProfile.PlannerProfileService;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDelete;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDeleteService;
import com.mysite.weddingyou_backend.userLogin.UserLogin;
import com.mysite.weddingyou_backend.userLogin.UserLoginRepository;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDelete;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDeleteService;


@RestController
public class PaymentController {
	
	@Autowired
	PaymentService paymentService;
	
	@Autowired
	PlannerLoginRepository plannerLoginRepository;
	
	@Autowired
	UserLoginRepository userLoginRepository;
	
	@Autowired
	ItemRepository itemRepository;
	
	@Autowired
	EstimateService estimateService;
	
	@Autowired
	UserUpdateDeleteService userService;
	
	@Autowired
	PlannerUpdateDeleteService plannerService ;

	@Autowired
	PlannerProfileService plannerProfileService;
	
	@Autowired
	EstimateRepository estimateRepository;
	
//    private IamportClient api;
//
//    public PaymentController() {
//        this.api = new IamportClient("4682177181885536","ZLbvvl3cqH1SwCB549U1cZ2QVJc1lTSr7nhRnKaQX2Rt0wz79Ys2enLxfWhpuKvI4Ol0QNvj5lxMaKLx");
//    }
    
    @PostMapping(value = "/deposit/callback")
    public int handleDepositCallback(@RequestBody PaymentCallbackRequest callbackRequest) {
      // 콜백 이벤트 처리 로직
    	BigDecimal price = callbackRequest.getPrice();
    	Integer quantity = callbackRequest.getQuantity();
    	String paymentMethod = callbackRequest.getPaymentMethod();
    	BigDecimal paymentAmount = callbackRequest.getPaymentAmount();
    	callbackRequest.setPaymentStatus(callbackRequest.getTempPaymentStatus());
      String paymentStatus = callbackRequest.getPaymentStatus();
      BigDecimal depositAmount;
      callbackRequest.setDepositStatus(callbackRequest.getTempDepositStatus());
      String depositStatus = callbackRequest.getDepositStatus();
      String paymentType = callbackRequest.getPaymentType();
      String userEmail = callbackRequest.getUserEmail(); 
      String plannerEmail = callbackRequest.getPlannerEmail(); 
      Long estimateId = callbackRequest.getEstimateId(); 
        
      //현재 시간 가져옴
      LocalDateTime currentTime = LocalDateTime.now();
        
      // getting planner data
      PlannerLogin planner = plannerLoginRepository.findByEmail(plannerEmail);
      int plannerCareerYears = Integer.parseInt(planner.getPlannerCareerYears());
      if(plannerCareerYears >= 0 && plannerCareerYears <5) {
        depositAmount = new BigDecimal(50000);
      }else if(plannerCareerYears >= 5 && plannerCareerYears <15) {
        depositAmount = new BigDecimal(100000);
      }else {
        depositAmount = new BigDecimal(150000);
      }
        
      UserLogin user = userLoginRepository.findByEmail(userEmail);
        
    	if(paymentService.getPaymentData(estimateId)==null) { 
        Payment payment = new Payment();
        payment.setPrice(price);
        payment.setQuantity(quantity);
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentAmount(paymentAmount);
        payment.setPaymentStatus(paymentStatus);
        payment.setDepositAmount(depositAmount);
        payment.setDepositStatus(depositStatus);
        payment.setPaymentType(paymentType);
        payment.setUserEmail(userEmail);
        payment.setPlannerEmail(plannerEmail);
        payment.setEstimateId(estimateId);
        payment.setPaymentDate(null);
        payment.setDepositDate(null);
        payment.setPlanner(planner);
        payment.setUser(user);
        if (paymentType.equals("deposit") && depositStatus.equals("paid")) {
          payment.setDepositDate(currentTime);
        } 
        paymentService.savePayment(payment);
    	}else { 
    		List<Payment> targetPayments = paymentService.getPaymentData(estimateId);
    		Payment targetPayment = targetPayments.stream()
    					.filter(p -> p.getPlannerEmail().equals(plannerEmail) && p.getUserEmail().equals(userEmail))
    					.findFirst()
    					.orElse(null);
				targetPayment.setPrice(price);
    		targetPayment.setQuantity(quantity);
    		targetPayment.setPaymentMethod(paymentMethod);
    		targetPayment.setPaymentAmount(paymentAmount);
    		targetPayment.setPaymentStatus(paymentStatus);
    		targetPayment.setDepositAmount(depositAmount);
    		targetPayment.setDepositStatus(depositStatus);
    		targetPayment.setPaymentType(paymentType);
    		targetPayment.setUserEmail(userEmail);
    		targetPayment.setPlannerEmail(plannerEmail);
    		targetPayment.setEstimateId(estimateId);
    		targetPayment.setPaymentDate(null);
    		if((depositStatus.equals("cancelled") && paymentType.equals("deposit"))
    				|| (depositStatus.equals("other") && paymentType.equals("deposit"))) {
    			targetPayment.setDepositDate(null);
    		}

    		targetPayment.setPlanner(planner);
				targetPayment.setUser(user);
    		
    		if (paymentType.equals("deposit") && depositStatus.equals("paid")) {
    			targetPayment.setDepositDate(currentTime);
				}
    		paymentService.savePayment(targetPayment);
    	}

      return plannerCareerYears;
    }
    
    @PostMapping(value = "/deposit/check")
    public String depositCheck(@RequestParam(value="estimateId") Long estimateId, 
		@RequestParam(value="userEmail") String userEmail, @RequestParam(value="plannerEmail") String plannerEmail) throws ParseException {
    	List<Payment> targetPayments = paymentService.getPaymentData(estimateId);
			Payment targetPayment = targetPayments.stream()
			.filter(p -> p.getPlannerEmail().equals(plannerEmail) && p.getUserEmail().equals(userEmail))
			.findFirst()
			.orElse(null);
			if(targetPayment!=null) {
    		String depositStatus = targetPayment.getDepositStatus();
    		String paymentStatus = targetPayment.getPaymentStatus();

        if(paymentStatus.equals("paid")) {
        	return "completed";
        }
        if(depositStatus.equals("cancelled") || depositStatus.equals("other")) {
					return "deposit";
        }else if(depositStatus.equals("paid")) {
					return "payment";
				}else{
					return "-1";
				}
			}else {
    		return "deposit";
    	}
    }
    
    @PostMapping(value = "/payment/callback")
    public int handlePaymentCallback(@RequestBody PaymentCallbackRequest callbackRequest) {
        // 콜백 이벤트 처리 로직
        Long estimateId = callbackRequest.getEstimateId();
        String paymentStatus = callbackRequest.getTempPaymentStatus();
//        String depositStatus = callbackRequest.getTempDepositStatus();
        String paymentType = callbackRequest.getPaymentType();
        BigDecimal paymentAmount = callbackRequest.getPaymentAmount();
				String userEmail = callbackRequest.getUserEmail();
				String plannerEmail = callbackRequest.getPlannerEmail();

        // 현재 시간 가져옴
        LocalDateTime currentTime = LocalDateTime.now();

        // 데이터베이스에서 해당 estimateId에 해당하는 Payment 객체 가져옴
				List<Payment> targetPayments = paymentService.getPaymentData(estimateId);
				Payment payment = targetPayments.stream()
				.filter(p -> p.getPlannerEmail().equals(plannerEmail) && p.getUserEmail().equals(userEmail))
				.findFirst()
				.orElse(null);
        if(payment!=null && payment.getDepositStatus().equals("paid")) {
        	if (payment.getPaymentType().equals("all") && paymentStatus.equals("cancelled")
        			|| payment.getPaymentType().equals("deposit") && payment.getPaymentStatus().equals("other")) {
                // 계약금 결제 처리
        		 payment.setPaymentStatus(paymentStatus);
        		 payment.setPaymentType(paymentType);
        		 payment.setPaymentAmount(paymentAmount);
        		 payment.setPrice(paymentAmount);
        		 paymentService.savePayment(payment);
        		 return 0;
            }  else if (paymentType.equals("all") && paymentStatus.equals("paid")) {
                // 전체 금액 결제 처리
            	payment.setPaymentType(paymentType);
                payment.setPaymentStatus(paymentStatus);
                payment.setPaymentDate(currentTime);
                payment.setPrice(paymentAmount);
                payment.setPaymentAmount(paymentAmount);                // Payment 객체를 데이터베이스에 저장
                paymentService.savePayment(payment);
                return 1;
            	
            	
            }  else if(payment.getPaymentType().equals("all") && payment.getPaymentStatus().equals("paid")){
            	return 2;
            	
            } else if(!payment.getPaymentType().equals("deposit") && !payment.getPaymentType().equals("all")) {
                System.out.println("유효하지 않은 결제 유형입니다.");
                return -1;
            } else {
            	return -2;
            }
        	
          
        }else {
        	  return -2; //deposit 결제 하지 않고 전액 결제로 넘어갈수 없음.
        	  
        }
    }

  @PostMapping(value = "/payment-status")
	public List<Payment> getPaymentStatus(@RequestParam String category, @RequestParam String email) throws ParseException {
    List<Payment> paymentsList = new ArrayList<>();
    JSONParser parser = new JSONParser();

    if (category.equals("user")) {
      List<Estimate> allEstimates = estimateService.getEstimateDetailByEmail(email);
      if (allEstimates != null) {
        List<Estimate> targetEstimates = allEstimates.stream()
          .filter(e -> {
            try {
              if (e.getUserMatching() == null || e.getPlannermatching() == null) {
                return false;
              }
              JSONArray userMatching = (JSONArray) parser.parse(e.getUserMatching());
              JSONArray plannerMatching = (JSONArray) parser.parse(e.getPlannermatching());

              List<String> userList = (List<String>) plannerMatching.stream()
                .map(Object::toString)
                .collect(Collectors.toList());

              List<String> plannerList = (List<String>) userMatching.stream()
                .map(Object::toString)
                .collect(Collectors.toList());

              Set<String> mergedSet = new LinkedHashSet<>(userList);
              mergedSet.addAll(plannerList);

              boolean result = (userList.size() + plannerList.size()) != mergedSet.size();
              if (result && !plannerList.isEmpty()) {
                String plannerEmail = plannerList.get(0);
                PlannerProfileDTO plannerData = plannerProfileService.getPlannerByEmail(plannerEmail);
                e.setPlannerProfiles(List.of(plannerData));
              }
              return result;
            } catch (Exception ex) {
              ex.printStackTrace();
              return false;
            }
          })
          .collect(Collectors.toList());

          List<Long> estimateIds = targetEstimates.stream()
            .map(Estimate::getId)
            .collect(Collectors.toList());

          paymentsList = paymentService.getPaymentsList(estimateIds);
        }
    	} else if (category.equals("planner")) {
        List<Estimate> allEstimates = estimateService.getlist();
        if (allEstimates != null) {
          List<Estimate> targetEstimates = allEstimates.stream()
            .filter(e -> {
              try {
                if (e.getUserMatching() == null || e.getPlannermatching() == null) {
                  return false;
                }
                JSONArray userMatching = (JSONArray) parser.parse(e.getUserMatching());
                JSONArray plannerMatching = (JSONArray) parser.parse(e.getPlannermatching());

                List<String> userList = (List<String>) plannerMatching.stream()
                  .map(Object::toString)
                  .collect(Collectors.toList());

                List<String> plannerList = (List<String>) userMatching.stream()
                  .map(Object::toString)
                  .collect(Collectors.toList());

                  return plannerList.contains(email) && userList.contains(email);
                } catch (Exception ex) {
                  ex.printStackTrace();
                  return false;
                }
              })
              .collect(Collectors.toList());

            List<Long> estimateIds = targetEstimates.stream()
                .map(Estimate::getId)
                .collect(Collectors.toList());

            paymentsList = paymentService.getPaymentsList(estimateIds);
        }
    }

    return paymentsList;
}
}