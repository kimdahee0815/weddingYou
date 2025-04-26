package com.mysite.weddingyou_backend.payment;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

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
	EstimateRepository estimateRepository;
	
//    private IamportClient api;
//
//    public PaymentController() {
//        this.api = new IamportClient("4682177181885536","ZLbvvl3cqH1SwCB549U1cZ2QVJc1lTSr7nhRnKaQX2Rt0wz79Ys2enLxfWhpuKvI4Ol0QNvj5lxMaKLx");
//    }
    
    @PostMapping(value = "/deposit/callback")
    public int handleDepositCallback(@RequestBody PaymentCallbackRequest callbackRequest) {
        // 콜백 이벤트 처리 로직
    	PaymentCallbackRequest temp = new PaymentCallbackRequest();
    	BigDecimal price = callbackRequest.getPrice();
    	Integer quantity = callbackRequest.getQuantity();
    	String paymentMethod = callbackRequest.getPaymentMethod();
    	BigDecimal paymentAmount = callbackRequest.getPaymentAmount();
    	callbackRequest.setPaymentStatus(callbackRequest.getTempPaymentStatus());
        String paymentStatus = callbackRequest.getPaymentStatus();
    //    BigDecimal depositAmount = callbackRequest.getDepositAmount();
        BigDecimal depositAmount;
        callbackRequest.setDepositStatus(callbackRequest.getTempDepositStatus());
        String depositStatus = callbackRequest.getDepositStatus();
        String paymentType = callbackRequest.getPaymentType();
        String userEmail = callbackRequest.getUserEmail(); // userEmail 추가
        String plannerEmail = callbackRequest.getPlannerEmail(); // plannerEmail 추가
        Long estimateId = callbackRequest.getEstimateId(); // estimateId 추가)
        System.out.println("estimateId:"+estimateId);
        
        //현재 시간 가져옴
        LocalDateTime currentTime = LocalDateTime.now();
        
        // 데이터베이스에서 Planner 정보 가져오기
        PlannerLogin planner = plannerLoginRepository.findByEmail(plannerEmail);
        String plannerName = planner.getName();
        String plannerImg = planner.getPlannerImg();
        int plannerCareerYears = Integer.parseInt(planner.getPlannerCareerYears());
        if(plannerCareerYears >= 0 && plannerCareerYears <5) {
        	depositAmount = new BigDecimal(50000);
        }else if(plannerCareerYears >= 5 && plannerCareerYears <15) {
        	depositAmount = new BigDecimal(100000);
        }else {
        	depositAmount = new BigDecimal(150000);
        }
        
        // 데이터베이스에서 User 정보 가져오기
        UserLogin user = userLoginRepository.findByEmail(userEmail);
        
    	if(paymentService.getPaymentData(callbackRequest.getEstimateId())==null) {

            // 데이터베이스에서 Item 정보 가져오기
         //   Optional<Item> item = itemRepository.findById(itemId);
            
            // 데이터베이스에 저장하기 위해 Payment 객체 생성
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
        //    payment.setItemId(itemId);
            
            // 플래너 정보를 Payment 객체에 설정
        //    payment.setPlanner(planner);
            
            if (paymentType.equals("deposit") && callbackRequest.getDepositStatus().equals("paid")) {
                payment.setDepositDate(currentTime);
                
            } 
            
            // Payment 객체를 데이터베이스에 저장
            paymentService.savePayment(payment);
    	}else { //estimateId가 겹칠 경우에 관련 데이터 업데이트
    		Payment targetPayment = paymentService.getPaymentData(callbackRequest.getEstimateId());
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
    		if((targetPayment.getDepositStatus()=="cancelled" && targetPayment.getPaymentType().equals("deposit"))
    				|| (targetPayment.getDepositStatus()=="other" && targetPayment.getPaymentType().equals("deposit"))) {
    			targetPayment.setDepositDate(null);
    		}
    	
    		
    	//	targetPayment.setPlanner(planner);
    		
    		 if (paymentType.equals("deposit") && callbackRequest.getDepositStatus().equals("paid")) {
    			 targetPayment.setDepositDate(currentTime);
                 
             }
    		  paymentService.savePayment(targetPayment);
    	}
    	
        
       // API 응답에 플래너의 이름과 이미지를 포함하여 전달
//        PaymentResponse response = new PaymentResponse(payment, plannerName, plannerImg);
//        return ResponseEntity.ok(response);
        
        return plannerCareerYears;
    }
    
    @PostMapping(value = "/deposit/check")
    public String depositCheck(@RequestParam(value="estimateNum") int estimateNum, @RequestParam(value="userEmail") String userEmail) throws ParseException {
    	List<Estimate> estimateData = paymentService.getEstimateList(userEmail);
    	Estimate searchedEstimate = null;
    	for(int i =0;i<estimateData.size();i++) {
    		Estimate targetEstimate = estimateData.get(i);
    		if(i==estimateNum) {
    			searchedEstimate = targetEstimate;
    		}
    	}
    	System.out.println("++++++++++++++++++++++++++++++++++++++++++++++++++++++"+estimateNum);
    	System.out.println(searchedEstimate.getId());
    			Payment targetPayment = paymentService.getPaymentData(searchedEstimate.getId());
    			System.out.println(targetPayment);
    			if(targetPayment!=null) {
    				String depositStatus = targetPayment.getDepositStatus();
    				String paymentStatus = targetPayment.getPaymentStatus();
        			System.out.println(depositStatus);
        			if(paymentStatus.equals("paid")) {
        				return "1";
        			}
        			if(depositStatus.equals("cancelled") || depositStatus.equals("other")) {
        				String result="";
        				
    					UserUpdateDelete data = userService.getUserByEmail(userEmail);
    					PlannerUpdateDelete plannerData = plannerService.getPlannerByEmail(targetPayment.getPlannerEmail());
    					
    					System.out.println(data.getName());
    					
    					String estimateId = targetPayment.getEstimateId() + "*";
    					result +=estimateId;
    					String userName = data.getName()+"/";
    					result += userName;
    					System.out.println(data.getPhoneNum());
    					String userPhone = data.getPhoneNum()+"]";
    					result+= userPhone;

    					String plannerEmail = plannerData.getEmail()+"[";
    					result +=plannerEmail;
    					String plannerName = plannerData.getName()+",";
    					result+=plannerName;
    					int careerYears = Integer.parseInt(plannerData.getPlannerCareerYears());
    					int depositAmount = 0;
    					if(careerYears>=0 && careerYears <5) {
    						depositAmount=50000;
    					}else if(careerYears<15) {
    						depositAmount=100000;
    					}else {
    						depositAmount=150000;
    					}
    					String price = depositAmount+"*";
    					result+=price;
    				         
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
    				    String depositStatusMsg = "[deposit";
    				    result += depositStatusMsg;
    				    

    					System.out.println("result"+result);
    					return result;
        				
        			}else if(depositStatus.equals("paid")) {
        				String result="";
        				
    					UserUpdateDelete data = userService.getUserByEmail(userEmail);
    					PlannerUpdateDelete plannerData = plannerService.getPlannerByEmail(targetPayment.getPlannerEmail());
    					
    					System.out.println(data.getName());
    					
    					String estimateId = targetPayment.getEstimateId() + "*";
    					result +=estimateId;
    					String userName = data.getName()+"/";
    					result += userName;
    					System.out.println(data.getPhoneNum());
    					String userPhone = data.getPhoneNum()+"]";
    					result+= userPhone;

    					String plannerEmail = plannerData.getEmail()+"[";
    					result +=plannerEmail;
    					String plannerName = plannerData.getName()+",";
    					result+=plannerName;
    					int careerYears = Integer.parseInt(plannerData.getPlannerCareerYears());
    					int depositAmount = 0;
    					if(careerYears>=0 && careerYears <5) {
    						depositAmount=50000;
    					}else if(careerYears<15) {
    						depositAmount=100000;
    					}else {
    						depositAmount=150000;
    					}
    					String price = depositAmount+"*";
    					result+=price;
    				         
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
    				    String depositStatusMsg = "[paid";
    				    result += depositStatusMsg;

    					System.out.println("result"+result);
    					return result;
        			}else {
        				return "-1";
        			}
    			}else {
    				PaymentCallbackRequest callbackRequest = new PaymentCallbackRequest();
    				BigDecimal tempPrice = new BigDecimal(searchedEstimate.getBudget());
    				BigDecimal price = tempPrice;
    		    	Integer quantity = 1;
    		    	String paymentMethod = "card";
    		    	BigDecimal paymentAmount = new BigDecimal(searchedEstimate.getBudget());
    		    	
    		        String paymentStatus = "other";
    		        PlannerUpdateDelete plannerData = plannerService.getPlannerByEmail(targetPayment.getPlannerEmail());
    		        int careerYears = Integer.parseInt(plannerData.getPlannerCareerYears());
					int depositAmount1 = 0;
					if(careerYears>=0 && careerYears <5) {
						depositAmount1=50000;
					}else if(careerYears<15) {
						depositAmount1=100000;
					}else {
						depositAmount1=150000;
					}
    		        BigDecimal depositAmount = new BigDecimal(depositAmount1);
    	
    		        String depositStatus = "cancelled";
    		        String paymentType = "deposit";
    		        String useremail = searchedEstimate.getWriter(); // userEmail 추가
    		        JSONParser parser = new JSONParser();
					ArrayList<String> plannermatching = (ArrayList<String>) parser.parse(searchedEstimate.getPlannermatching());
    		        String planneremail = plannermatching.get(0);// plannerEmail 추가
    		        Long estimateId = searchedEstimate.getId(); // estimateId 추가)
    		        
    		        //현재 시간 가져옴
    		        LocalDateTime currentTime = LocalDateTime.now();
    		        
    		        // 데이터베이스에서 Planner 정보 가져오기
    		        PlannerLogin planner = plannerLoginRepository.findByEmail(planneremail);
    		        String plannerName = planner.getName();
    		        String plannerImg = planner.getPlannerImg();
    		        
    		        // 데이터베이스에서 User 정보 가져오기
    		        UserLogin user = userLoginRepository.findByEmail(userEmail);
    		        
    		    	if(paymentService.getPaymentData(estimateId)==null) {

    		            // 데이터베이스에서 Item 정보 가져오기
    		         //   Optional<Item> item = itemRepository.findById(itemId);
    		            
    		            // 데이터베이스에 저장하기 위해 Payment 객체 생성
    		            Payment payment = new Payment();
    		            payment.setPrice(price);
    		            payment.setQuantity(quantity);
    		            payment.setPaymentMethod(paymentMethod);
    		            payment.setPaymentAmount(paymentAmount);
    		            payment.setPaymentStatus(paymentStatus);
    		            payment.setDepositAmount(depositAmount);
    		            payment.setDepositStatus(depositStatus);
    		            payment.setPaymentType(paymentType);
    		            payment.setUserEmail(useremail);
    		            payment.setPlannerEmail(planneremail);
    		            payment.setEstimateId(estimateId);
    		            payment.setPaymentDate(null);
    		            payment.setDepositDate(null);
    		        //    payment.setItemId(itemId);
    		            
    		            // 플래너 정보를 Payment 객체에 설정
    		        //    payment.setPlanner(planner);
    		            
    		            if (paymentType.equals("deposit") && depositStatus.equals("paid")) {
    		                payment.setDepositDate(currentTime);
    		                
    		            } 
    		            
    		            // Payment 객체를 데이터베이스에 저장
    		            paymentService.savePayment(payment);
    		    	}else { //estimateId가 겹칠 경우에 관련 데이터 업데이트
    		    		Payment targetPayment2 = paymentService.getPaymentData(callbackRequest.getEstimateId());
    		    		targetPayment2.setPrice(price);
    		    		targetPayment2.setQuantity(quantity);
    		    		targetPayment2.setPaymentMethod(paymentMethod);
    		    		targetPayment2.setPaymentAmount(paymentAmount);
    		    		targetPayment2.setPaymentStatus(paymentStatus);
    		    		targetPayment2.setDepositAmount(depositAmount);
    		    		targetPayment2.setDepositStatus(depositStatus);
    		    		targetPayment2.setPaymentType(paymentType);
    		    		targetPayment2.setUserEmail(userEmail);
    		    		targetPayment2.setPlannerEmail(planneremail);
    		    		targetPayment2.setEstimateId(estimateId);
    		    		targetPayment2.setPaymentDate(null);
    		    		if((targetPayment.getDepositStatus()=="cancelled" && targetPayment.getPaymentType().equals("deposit"))
    		    				|| (targetPayment.getDepositStatus()=="other" && targetPayment.getPaymentType().equals("deposit"))) {
    		    			targetPayment.setDepositDate(null);
    		    		}
    		    	//	targetPayment.setPlanner(planner);
    		    		
    		    		 if (paymentType.equals("deposit") && depositStatus.equals("paid")) {
    		    			 targetPayment2.setDepositDate(currentTime);
    		                 
    		             }
    		    		  paymentService.savePayment(targetPayment2);
    		    	}
    		    	
    		    	String result="";
    				
					UserUpdateDelete data = userService.getUserByEmail(useremail);
					
					System.out.println(data.getName());
					
					String estimateId2 = estimateId + "*";
					result +=estimateId2;
					String userName = data.getName()+"/";
					result += userName;
					System.out.println(data.getPhoneNum());
					String userPhone = data.getPhoneNum()+"]";
					result+= userPhone;

					String plannerEmail = plannerData.getEmail()+"[";
					result +=plannerEmail;
					String plannername = plannerData.getName()+",";
					result+=plannername;
					String paymentAmount2 = paymentAmount+"*";
					result+=paymentAmount2;
				         
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
				    String depositStatusMsg = "[deposit";
				    result += depositStatusMsg;
				    

					System.out.println("result"+result);
					return result;
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

        // 현재 시간 가져옴
        LocalDateTime currentTime = LocalDateTime.now();

        // 데이터베이스에서 해당 estimateId에 해당하는 Payment 객체 가져옴
        Payment payment = paymentService.getPaymentData(estimateId);
        System.out.println(payment.getDepositStatus());
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
        
        @PostMapping(value = "/paymentStatus")
        public List<String> getPaymentStatus(@RequestParam JSONArray estimateNum, @RequestParam String category, @RequestParam String email) throws ParseException {
        	if(category.equals("user")) {
        		List<Estimate> estimatesData = estimateRepository.findAllByWriter(email);
        		System.out.println("estimateNum:"+estimateNum);
        		JSONParser parser = new JSONParser();
				//ArrayList<Integer> estimateNumArr = (ArrayList<Integer>) parser.parse(estimateNum);
				ArrayList<String> result = new ArrayList<>();
				
				for(int i =0;i<estimatesData.size();i++) {
					if(i==Integer.parseInt((String) estimateNum.get(i)) && estimatesData.get(i).isMatchstatus()) {
						Long estimateId = estimatesData.get(i).getId();
						System.out.println("estimateId >> "+estimateId);
						
						Payment targetPayment = paymentService.getPaymentData(estimateId);
						String paymentStatus = targetPayment.getPaymentStatus();	
						String depositStatus = targetPayment.getDepositStatus();
						String resultStatus = "";
						if(depositStatus.equals("paid")&& !paymentStatus.equals("paid")) {
							resultStatus = "deposit";
						}else if(depositStatus.equals("paid") && paymentStatus.equals("paid")) {
							resultStatus = "all";
						}else {
							resultStatus = "other";
						}
						result.add(resultStatus);
					}
				}
				
				return result;
        	}else if(category.equals("planner")) {
        		List<Estimate> estimatesData = estimateRepository.findAll();
        		System.out.println("estimateNum:"+estimateNum);
        		 JSONParser parser = new JSONParser();
			//	ArrayList<Integer> estimateNumArr = (ArrayList<Integer>) parser.parse(estimateNum);
				ArrayList<String> result = new ArrayList<>();
				int k = 0;
				
				for(int i =0;i<estimatesData.size();i++) {
					Estimate targetEstimate = estimatesData.get(i);
				
					ArrayList<String> userMatching = (ArrayList<String>)  parser.parse(targetEstimate.getUserMatching());
					if(userMatching.contains(email)) {
						if(targetEstimate.isMatchstatus() && Integer.parseInt((String) estimateNum.get(k)) == k) {
							Long estimateId = targetEstimate.getId();
							System.out.println("estimateId => "+estimateId);
							Payment targetPayment = paymentService.getPaymentData(estimateId);
							if(targetPayment==null) {
								PaymentCallbackRequest callbackRequest = new PaymentCallbackRequest();
			    				BigDecimal tempPrice = new BigDecimal(targetEstimate.getBudget());
			    				BigDecimal price = tempPrice;
			    		    	Integer quantity = 1;
			    		    	String paymentMethod = "card";
			    		    	BigDecimal paymentAmount = new BigDecimal(targetEstimate.getBudget());
			    		    	
			    		        String paymentStatus = "other";
			    		        PlannerUpdateDelete plannerData = plannerService.getPlannerByEmail(email);
			    		        int careerYears = Integer.parseInt(plannerData.getPlannerCareerYears());
								int depositAmount1 = 0;
								if(careerYears>=0 && careerYears <5) {
									depositAmount1=50000;
								}else if(careerYears<15) {
									depositAmount1=100000;
								}else {
									depositAmount1=150000;
								}
			    		        BigDecimal depositAmount = new BigDecimal(depositAmount1);
			    	
			    	
			    		        String depositStatus = "cancelled";
			    		        String paymentType = "deposit";
			    		        String useremail = targetEstimate.getWriter(); // userEmail 추가
			    		       
								ArrayList<String> plannermatching = (ArrayList<String>) parser.parse(targetEstimate.getPlannermatching());
			    		        String planneremail = plannermatching.get(0);// plannerEmail 추가
			    		        Long estimateId2 = targetEstimate.getId(); // estimateId 추가)
			    		        
			    		        //현재 시간 가져옴
			    		        LocalDateTime currentTime = LocalDateTime.now();
			    		        
			    		        // 데이터베이스에서 Planner 정보 가져오기
			    		        PlannerLogin planner = plannerLoginRepository.findByEmail(planneremail);
			    		        String plannerName = planner.getName();
			    		        String plannerImg = planner.getPlannerImg();
			    		        
			    		        // 데이터베이스에서 User 정보 가져오기
			    		        UserLogin user = userLoginRepository.findByEmail(useremail);
			    		        
			    		    	if(paymentService.getPaymentData(estimateId)==null) {

			    		            // 데이터베이스에서 Item 정보 가져오기
			    		         //   Optional<Item> item = itemRepository.findById(itemId);
			    		            
			    		            // 데이터베이스에 저장하기 위해 Payment 객체 생성
			    		            Payment payment = new Payment();
			    		            payment.setPrice(price);
			    		            payment.setQuantity(quantity);
			    		            payment.setPaymentMethod(paymentMethod);
			    		            payment.setPaymentAmount(paymentAmount);
			    		            payment.setPaymentStatus(paymentStatus);
			    		            payment.setDepositAmount(depositAmount);
			    		            payment.setDepositStatus(depositStatus);
			    		            payment.setPaymentType(paymentType);
			    		            payment.setUserEmail(useremail);
			    		            payment.setPlannerEmail(planneremail);
			    		            payment.setEstimateId(estimateId2);
			    		            payment.setPaymentDate(null);
			    		            payment.setDepositDate(null);
			    		        //    payment.setItemId(itemId);
			    		            
			    		            // 플래너 정보를 Payment 객체에 설정
			    		        //    payment.setPlanner(planner);
			    		            
			    		            if (paymentType.equals("deposit") && depositStatus.equals("paid")) {
			    		                payment.setDepositDate(currentTime);
			    		                
			    		            } 
			    		            
			    		            // Payment 객체를 데이터베이스에 저장
			    		            paymentService.savePayment(payment);
			    		    	}else { //estimateId가 겹칠 경우에 관련 데이터 업데이트
			    		    		Payment targetPayment2 = paymentService.getPaymentData(estimateId);
			    		    		targetPayment2.setPrice(price);
			    		    		targetPayment2.setQuantity(quantity);
			    		    		targetPayment2.setPaymentMethod(paymentMethod);
			    		    		targetPayment2.setPaymentAmount(paymentAmount);
			    		    		targetPayment2.setPaymentStatus(paymentStatus);
			    		    		targetPayment2.setDepositAmount(depositAmount);
			    		    		targetPayment2.setDepositStatus(depositStatus);
			    		    		targetPayment2.setPaymentType(paymentType);
			    		    		targetPayment2.setUserEmail(useremail);
			    		    		targetPayment2.setPlannerEmail(planneremail);
			    		    		targetPayment2.setEstimateId(estimateId2);
			    		    		targetPayment2.setPaymentDate(null);
			    		    		if((targetPayment.getDepositStatus()=="cancelled" && targetPayment.getPaymentType().equals("deposit"))
			    		    				|| (targetPayment.getDepositStatus()=="other" && targetPayment.getPaymentType().equals("deposit"))) {
			    		    			targetPayment.setDepositDate(null);
			    		    		}
			    		    	//	targetPayment.setPlanner(planner);
			    		    		
			    		    		 if (paymentType.equals("deposit") && depositStatus.equals("paid")) {
			    		    			 targetPayment2.setDepositDate(currentTime);
			    		                 
			    		             }
			    		    		  paymentService.savePayment(targetPayment2);
			    		    	}
							}
							System.out.println(estimateId);
							Payment targetPayment2 = paymentService.getPaymentData(estimateId);
								String paymentStatus = targetPayment2.getPaymentStatus();				
								System.out.println(paymentStatus);
								String depositStatus = targetPayment2.getDepositStatus();
								System.out.println(depositStatus);
								String resultStatus = "";
								if(depositStatus.equals("paid")&& !paymentStatus.equals("paid")) {
									resultStatus = "deposit";
								}else if(depositStatus.equals("paid") && paymentStatus.equals("paid")) {
									resultStatus = "all";
								}else {
									resultStatus = "other";
								}
								result.add(resultStatus);
								
							
						}
						k++;
						
					}
					
				}
				
				return result;
        	}else {
        		ArrayList<String> result = new ArrayList<>();
				return result;
        	}
        }
        	
        	 @PostMapping(value = "/paymentStatus2")
             public List<String> getPaymentStatus2(@RequestParam String category, @RequestParam String email) throws ParseException {
             	if(category.equals("user")) {
             		List<Estimate> estimatesData = estimateRepository.findAllByWriter(email);
             		
     				ArrayList<String> result = new ArrayList<>();
     				
     				for(int i =0;i<estimatesData.size();i++) {
     					Estimate targetEstimate = estimatesData.get(i);
     					if(targetEstimate.isMatchstatus()) {
     						Long estimateId = targetEstimate.getId();
     						Payment targetPayment = paymentService.getPaymentData(estimateId);
     						if(targetPayment.getPaymentStatus().equals("paid") && targetPayment.getDepositStatus().equals("paid")) {
     							result.add("all");
     						}else if(!targetPayment.getPaymentStatus().equals("paid") &&targetPayment.getDepositStatus().equals("paid")) {
     							result.add("deposit");
     						}else {
     							result.add("other");
     						}
     					}else {
     						result.add("-1");
     					}
     					
     				}
     					
     				
     				return result;
             	}else if(category.equals("planner")) {
             		List<Estimate> estimatesData = estimateRepository.findAll();
             	
             		 JSONParser parser = new JSONParser();
     			
     				ArrayList<String> result = new ArrayList<>();
     				int k = 0;
     				
     				for(int i =0;i<estimatesData.size();i++) {
     					Estimate targetEstimate = estimatesData.get(i);
     				
     					ArrayList<String> userMatching = (ArrayList<String>)  parser.parse(targetEstimate.getUserMatching());
     					if(userMatching.contains(email)) {
     						Long estimateId = targetEstimate.getId();
 							System.out.println("estimateId => "+estimateId);
     						if(targetEstimate.isMatchstatus()) {
     						
     							Payment targetPayment = paymentService.getPaymentData(estimateId);
     							if(targetPayment==null) {
     								PaymentCallbackRequest callbackRequest = new PaymentCallbackRequest();
     			    				BigDecimal tempPrice = new BigDecimal(targetEstimate.getBudget());
     			    				BigDecimal price = tempPrice;
     			    		    	Integer quantity = 1;
     			    		    	String paymentMethod = "card";
     			    		    	BigDecimal paymentAmount = new BigDecimal(targetEstimate.getBudget());
     			    		    	
     			    		        String paymentStatus = "other";
     			    		       PlannerUpdateDelete plannerData = plannerService.getPlannerByEmail(email);
     			    		        int careerYears = Integer.parseInt(plannerData.getPlannerCareerYears());
     								int depositAmount1 = 0;
     								if(careerYears>=0 && careerYears <5) {
     									depositAmount1=50000;
     								}else if(careerYears<15) {
     									depositAmount1=100000;
     								}else {
     									depositAmount1=150000;
     								}
     			    		        BigDecimal depositAmount = new BigDecimal(depositAmount1);
     			    	
     			    		        String depositStatus = "cancelled";
     			    		        String paymentType = "deposit";
     			    		        String useremail = targetEstimate.getWriter(); // userEmail 추가
     			    		       
     								ArrayList<String> plannermatching = (ArrayList<String>) parser.parse(targetEstimate.getPlannermatching());
     			    		        String planneremail = plannermatching.get(0);// plannerEmail 추가
     			    		        Long estimateId2 = targetEstimate.getId(); // estimateId 추가)
     			    		        
     			    		        //현재 시간 가져옴
     			    		        LocalDateTime currentTime = LocalDateTime.now();
     			    		        
     			    		        // 데이터베이스에서 Planner 정보 가져오기
     			    		        PlannerLogin planner = plannerLoginRepository.findByEmail(planneremail);
     			    		        String plannerName = planner.getName();
     			    		        String plannerImg = planner.getPlannerImg();
     			    		        
     			    		        // 데이터베이스에서 User 정보 가져오기
     			    		        UserLogin user = userLoginRepository.findByEmail(useremail);
     			    		        
     			    		    	if(paymentService.getPaymentData(estimateId)==null) {

     			    		            // 데이터베이스에서 Item 정보 가져오기
     			    		         //   Optional<Item> item = itemRepository.findById(itemId);
     			    		            
     			    		            // 데이터베이스에 저장하기 위해 Payment 객체 생성
     			    		            Payment payment = new Payment();
     			    		            payment.setPrice(price);
     			    		            payment.setQuantity(quantity);
     			    		            payment.setPaymentMethod(paymentMethod);
     			    		            payment.setPaymentAmount(paymentAmount);
     			    		            payment.setPaymentStatus(paymentStatus);
     			    		            payment.setDepositAmount(depositAmount);
     			    		            payment.setDepositStatus(depositStatus);
     			    		            payment.setPaymentType(paymentType);
     			    		            payment.setUserEmail(useremail);
     			    		            payment.setPlannerEmail(planneremail);
     			    		            payment.setEstimateId(estimateId2);
     			    		            payment.setPaymentDate(null);
     			    		            payment.setDepositDate(null);
     			    		        //    payment.setItemId(itemId);
     			    		            
     			    		            // 플래너 정보를 Payment 객체에 설정
     			    		        //    payment.setPlanner(planner);
     			    		            
     			    		            if (paymentType.equals("deposit") && depositStatus.equals("paid")) {
     			    		                payment.setDepositDate(currentTime);
     			    		                
     			    		            } 
     			    		            
     			    		            // Payment 객체를 데이터베이스에 저장
     			    		            paymentService.savePayment(payment);
     			    		    	}else { //estimateId가 겹칠 경우에 관련 데이터 업데이트
     			    		    		Payment targetPayment2 = paymentService.getPaymentData(estimateId);
     			    		    		targetPayment2.setPrice(price);
     			    		    		targetPayment2.setQuantity(quantity);
     			    		    		targetPayment2.setPaymentMethod(paymentMethod);
     			    		    		targetPayment2.setPaymentAmount(paymentAmount);
     			    		    		targetPayment2.setPaymentStatus(paymentStatus);
     			    		    		targetPayment2.setDepositAmount(depositAmount);
     			    		    		targetPayment2.setDepositStatus(depositStatus);
     			    		    		targetPayment2.setPaymentType(paymentType);
     			    		    		targetPayment2.setUserEmail(useremail);
     			    		    		targetPayment2.setPlannerEmail(planneremail);
     			    		    		targetPayment2.setEstimateId(estimateId2);
     			    		    		targetPayment2.setPaymentDate(null);
     			    		    		if((targetPayment2.getDepositStatus()=="cancelled" && targetPayment2.getPaymentType().equals("deposit"))
    			    		    				|| (targetPayment2.getDepositStatus()=="other" && targetPayment2.getPaymentType().equals("deposit"))) {
     			    		    			targetPayment2.setDepositDate(null);
    			    		    		}
     			    		    	//	targetPayment.setPlanner(planner);
     			    		    		
     			    		    		 if (paymentType.equals("deposit") && depositStatus.equals("paid")) {
     			    		    			 targetPayment2.setDepositDate(currentTime);
     			    		                 
     			    		             }
     			    		    		  paymentService.savePayment(targetPayment2);
     			    		    	}
     							}
     					
     							Payment targetPayment2 = paymentService.getPaymentData(estimateId);
     								String paymentStatus = targetPayment2.getPaymentStatus();				
     								System.out.println(paymentStatus);
     								String depositStatus = targetPayment2.getDepositStatus();
     								System.out.println(depositStatus);
     								String resultStatus = "";
     								if(depositStatus.equals("paid")&& !paymentStatus.equals("paid")) {
     									resultStatus = "deposit";
     								}else if(depositStatus.equals("paid") && paymentStatus.equals("paid")) {
     									resultStatus = "all";
     								}else {
     									resultStatus = "other";
     								}
     								result.add(resultStatus);
	
     						}
     						else {
     							System.out.println("9999");
     							result.add("-1");
     							
     						}
     						
     					}
     					
     				}
     				System.out.println(result);
     				return result;
             	}else {
             		ArrayList<String> result = new ArrayList<>();
     				return result;
             	}
        
    }



}