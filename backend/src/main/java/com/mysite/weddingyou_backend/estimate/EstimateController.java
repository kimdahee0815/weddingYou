package com.mysite.weddingyou_backend.estimate;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mysite.weddingyou_backend.S3Service;
import com.mysite.weddingyou_backend.comment.Comment;
import com.mysite.weddingyou_backend.comment.CommentRepository;
import com.mysite.weddingyou_backend.payment.Payment;
import com.mysite.weddingyou_backend.payment.PaymentRepository;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLogin;
import com.mysite.weddingyou_backend.plannerProfile.PlannerProfile;
import com.mysite.weddingyou_backend.plannerProfile.PlannerProfileDTO;
import com.mysite.weddingyou_backend.plannerProfile.PlannerProfileService;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDelete;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDeleteRepository;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDeleteService;
import com.mysite.weddingyou_backend.review.Review;
import com.mysite.weddingyou_backend.review.ReviewRepository;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDelete;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDeleteService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/estimate")
public class EstimateController {

	@Autowired
	private final S3Service s3Service;

	public final EstimateService estimateService;
	
	@Autowired
	private PlannerUpdateDeleteService plannerService ;
	
	@Autowired
	private UserUpdateDeleteService userService ;

	@Autowired
	private PlannerProfileService plannerProfileService;
	
	@Autowired
	private EstimateRepository estimateRepository;
	
	@Autowired
	private PaymentRepository paymentRepository;
	
	@Autowired
	private PlannerUpdateDeleteRepository plannerUpdateDeleteRepository;
	
	@Autowired
	private ReviewRepository reviewRepository;
	
	@Autowired
	private CommentRepository commentRepository;
	
	@Value("${spring.servlet.multipart.location}")
    String uploadDir;

	@PostMapping(value = "/write", produces = "multipart/form-data")
	public void insertData(@RequestParam(value = "uploadfiles", required = false) MultipartFile[] uploadfiles,
	                       @RequestParam("weddingdate") String weddingdate,
	                       @RequestParam("budget") int budget,
	                       @RequestParam("region") String region,
	                       @RequestParam("honeymoon") String honeymoon,
	                       @RequestParam("makeup") String makeup,
	                       @RequestParam("dress") String dress,
	                       @RequestParam("requirement") String requirement,
	                       @RequestParam("studio") String studio,
	                       @RequestParam("writer") String writer)  throws IOException {
	    // 이미지 데이터 처리 로직
		List<String> list = new ArrayList<>();
		if(!(uploadfiles == null)) {
        for (MultipartFile file : uploadfiles) {
            if (!file.isEmpty()) {
								String imgUrl = s3Service.uploadFile(file, "estimates/");
								list.add("\"" + imgUrl + "\"");
						}
        }
		}
		Estimate data = new Estimate();
		data.setWeddingdate(weddingdate);
		data.setBudget(budget);
		data.setRegion(region);
		data.setHoneymoon(honeymoon);
		data.setMakeup(makeup);
		data.setDress(dress);
		data.setRequirement(requirement);
		data.setStudio(studio);
		data.setWriter(writer);
		data.setImg(list.toString());
		data.setMatchstatus(false);
		data.setTitle(writer + "님의 견적서");
		data.setDate(LocalDate.now());
		data.setViewcount(0);		
		data.setPlannermatching("[]");
		data.setUserMatching("[]");
		estimateService.insert(data);
	}
	
	//전체 데이터 조회
	@ResponseBody
	@GetMapping("/getlist")
	public ResponseEntity<List<Estimate>> getList() {
	    List<Estimate> list = estimateService.getlist();
	    return ResponseEntity.ok().body(list);
	}


	//전체 데이터 개수 조회
	@ResponseBody
	@GetMapping("/getcount")
	public ResponseEntity<Integer> getCount() {
		int count = estimateService.getcount();
		return ResponseEntity.ok().body(count);
	}
	
	//검색 데이터 조회	
	@GetMapping("/getsearchlist")
	public ResponseEntity<List<Estimate>> getsearchlist(@RequestParam String search){
		List<Estimate> list = estimateService.getsearchlist(search);
		return ResponseEntity.ok().body(list);
	}
	
	
	//이미지 출력 부분입니다.
	@RequestMapping("/imageview")
    public ResponseEntity<byte[]> imgView(@RequestParam("image") String imageUrl) throws MalformedURLException {
			String fullPath = imageUrl;
    
			if(fullPath != null){
				String key = fullPath.substring(fullPath.indexOf(".com/") + 5);
				key = URLDecoder.decode(key, StandardCharsets.UTF_8);
				byte[] imageBytes = s3Service.downloadFile(key);
	
				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(MediaType.IMAGE_JPEG);
	
				return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK); 
			}
		return ResponseEntity.notFound().build();
  }

	
	//견적서 상세정보 조회 + 조회수 증가
	@RequestMapping("/detail/{id}")
	public Estimate getdetail(@PathVariable ("id") int id) {
		return estimateService.getdetail(id);
	} 
		
	
	//견적서 삭제
	@Transactional
	@RequestMapping("/delete")
	public void delete(@RequestParam Long id) {
		Review review = reviewRepository.findByEstimateId(id);

		estimateService.delete(id);
		reviewRepository.deleteByEstimateId(id);
		paymentRepository.deleteByEstimateId(id);
		List<Comment> commentData = commentRepository.findAllByReview(review);
		if(commentData!=null) {
			for(int i=0;i<commentData.size();i++) {
				Comment targetReview = commentData.get(i);
				commentRepository.delete(targetReview);
			}
		}
		
	}
	
	
	
	//견적서 수정
	@PostMapping(value = "/modify", produces = "multipart/form-data")
	public void modifyData(@RequestParam(value = "uploadfiles", required = false) MultipartFile[] uploadfiles,
	                       @RequestParam("weddingdate") String weddingdate,
	                       @RequestParam("budget") int budget,
	                       @RequestParam("region") String region,
	                       @RequestParam("honeymoon") String honeymoon,
	                       @RequestParam("makeup") String makeup,
	                       @RequestParam("dress") String dress,
	                       @RequestParam("requirement") String requirement,
	                       @RequestParam("studio") String studio,
	                       @RequestParam("writer") String writer,  
	                       @RequestParam("previmage") String[] previmage,
	                       @RequestParam("date") String date,
	                       @RequestParam("viewcount") int viewcount,
	                       @RequestParam("id") long id)
	                    		   throws IOException {
	    // 이미지 데이터 처리 로직
		List<String> list = new ArrayList<>();
		for(int i = 0; i < previmage.length; i++) {
			list.add("\"" + previmage[i] + "\"");
		}
		if(!(uploadfiles == null)) {
        for (MultipartFile file : uploadfiles) {
					if (!file.isEmpty()) {
						String imgUrl = s3Service.uploadFile(file, "estimates/");
						list.add("\"" + imgUrl + "\"");
					}
        }
		}
		Estimate data = new Estimate();
		data.setWeddingdate(weddingdate);
		data.setBudget(budget);
		data.setRegion(region);
		data.setHoneymoon(honeymoon);
		data.setMakeup(makeup);
		data.setDress(dress);
		data.setRequirement(requirement);
		data.setStudio(studio);
		data.setWriter(writer);
		data.setImg(list.toString());
		data.setMatchstatus(false);
		data.setTitle(writer + "님의 견적서");
		data.setDate(LocalDate.parse(date));
		data.setViewcount(viewcount);		
		data.setId(id);
		estimateService.insert(data);
	}


	
	@PostMapping("/pageinglist")
	public List<Estimate> pageinglist(@RequestBody Map<String, Object> requestParams) {
	  int page_num = (int) requestParams.get("page_num");
	  int limit = (int) requestParams.get("limit");
	  
	  return estimateService.pageinglist(page_num, limit);
	}
	
	//견적서 매칭원하는 플래너 삽입하기
		@PostMapping(value = "/insert/matchingplanner")
		public void updateData(
		                       @RequestParam("id") Long id,
								@RequestParam("plannermatching") String plannermatching)
		                    		   throws Exception {
		    
			Estimate targetData = estimateService.getEstimateDetail(id);
			
			JSONParser parser = new JSONParser();
			ArrayList<String> obj = (ArrayList<String>) parser.parse(plannermatching);
			ArrayList<String> plannerList = null;
			if(targetData.getPlannermatching()!=null) {
				plannerList = (ArrayList<String>) parser.parse(targetData.getPlannermatching());
				System.out.println(plannerList);
			}
			 
			
			if(plannerList.size() == 0) {
				Estimate data = new Estimate();
				data.setPlannermatching(plannermatching);
				targetData.setPlannermatching(data.getPlannermatching());
				
				estimateService.save(targetData);
			}
			else if(plannerList.size()!=0 && !plannerList.containsAll(obj)) {
				Estimate data = new Estimate();
				data.setPlannermatching(plannermatching);
				targetData.setPlannermatching(data.getPlannermatching());
				
				estimateService.save(targetData);
			}else if(plannerList.size()!=0  && plannerList.containsAll(obj)){
				throw new Exception("중복됩니다!");
			}
			
		}

				@GetMapping(value = "/users/detail")
				public List<Estimate> getUserDetail(@RequestParam("userEmail") String userEmail) throws Exception {

					List<Estimate> allEstimates = estimateService.getlist();
					JSONParser parser = new JSONParser();
					if (allEstimates != null) {
						List<Estimate> targetEstimates = allEstimates.stream()
								.filter(e -> {
									try {
										if (e.getUserMatching() == null) {
												return false;
										}
										JSONArray userMatching = (JSONArray) parser.parse(e.getUserMatching());
										ArrayList<String> plannerList = (ArrayList<String>) userMatching.stream()
    									.map(Object::toString)
    									.collect(Collectors.toList());
										return plannerList.contains(userEmail);
									} catch (Exception ex) {
										ex.printStackTrace();
										return false;
									}
								})
								.collect(Collectors.toList());
						return targetEstimates;
				} else {
						throw new Exception("정보가 존재하지 않습니다!");
				}
				}
			
			
		//견적서 매칭원하는 플래너 정보 가져오기
		@GetMapping(value = "/planners/detail")
		public List<Estimate> getPlannersDetail(@RequestParam("userEmail") String userEmail) throws Exception {
    List<Estimate> allEstimates = estimateService.getEstimateDetailByEmail(userEmail);
    JSONParser parser = new JSONParser();

    if (allEstimates != null) {
        List<Estimate> targetEstimates = allEstimates.stream()
            .map(estimate -> {
                try {
                    if (estimate.getPlannermatching() != null) {
                        JSONArray plannerMatching = (JSONArray) parser.parse(estimate.getPlannermatching());
                        List<String> plannerList = (List<String>) plannerMatching.stream()
                                .map(Object::toString)
                                .collect(Collectors.toList());

                        List<PlannerProfileDTO> plannerDetailList = plannerList.stream()
                                .map(plannerEmail -> plannerProfileService.getPlannerByEmail(plannerEmail))
                                .collect(Collectors.toList());

                        estimate.setPlannerProfiles(plannerDetailList);  
                    }
                    return estimate;
                } catch (Exception e) {
                    e.printStackTrace();
                    return estimate;
                }
            })
            .collect(Collectors.toList());

        return targetEstimates;

    } else {
        throw new Exception("정보가 존재하지 않습니다!");
    }
	}
				
				//견적서 매칭원하는 플래너 이름 삭제하기
				@DeleteMapping(value = "/matching/planner")
				public int deleteMatchingPlanner(@RequestParam("deletePlanner") String deletePlanner, 
						@RequestParam("deleteTargetEstimateId") Long estimateId) throws Exception {
				  int res = 1;

					Estimate targetEstimate = estimateService.getEstimateDetail(estimateId);
					
					JSONParser parser = new JSONParser();
				  ArrayList<String> obj = (ArrayList<String>) parser.parse(targetEstimate.getPlannermatching());
				  obj.remove(deletePlanner);

				  if(targetEstimate.isMatchstatus()) {
				    ArrayList<String> obj2 = (ArrayList<String>) parser.parse(targetEstimate.getUserMatching());
						obj2.remove(deletePlanner);
						targetEstimate.setUserMatching(String.valueOf(obj2));
				    targetEstimate.setMatchstatus(false);
				    res=2;
				  }
				  Payment targetPayment = paymentRepository.findByEstimateId(estimateId);
				  if(targetPayment!=null) {
				    paymentRepository.delete(targetPayment);
				  }
				  targetEstimate.setPlannermatching(String.valueOf(obj));
				  estimateService.save(targetEstimate);
					
					return res;
				
				}

				@DeleteMapping(value = "/matching/user")
				public int deleteMatchingUser(@RequestParam("deletePlanner") String deletePlanner, 
						@RequestParam("deleteTargetEstimateId") Long estimateId) throws Exception {
				  int res = 1;

					Estimate targetEstimate = estimateService.getEstimateDetail(estimateId);
					
					JSONParser parser = new JSONParser();
				  ArrayList<String> obj = (ArrayList<String>) parser.parse(targetEstimate.getUserMatching());
				  obj.remove(deletePlanner);

				  if(targetEstimate.isMatchstatus()) {
				    ArrayList<String> obj2 = (ArrayList<String>) parser.parse(targetEstimate.getUserMatching());
						obj2.remove(deletePlanner);
						targetEstimate.setUserMatching(String.valueOf(obj2));
				    targetEstimate.setMatchstatus(false);
				    res=2;
				  }
				  Payment targetPayment = paymentRepository.findByEstimateId(estimateId);
				  if(targetPayment!=null) {
				    paymentRepository.delete(targetPayment);
				  }
				  targetEstimate.setPlannermatching(String.valueOf(obj));
				  estimateService.save(targetEstimate);
					
					return res;
				
				}
				
				//매칭하기
				@PostMapping(value = "/matching")
				public Estimate matchingPlanner(@RequestParam("matchingPlanner") String matchingPlanner, 
						@RequestParam("targetEstimateId") Long estimateId
						) throws Exception {
					Estimate targetEstimate = estimateService.getEstimateDetail(estimateId);

					JSONParser parser = new JSONParser();
				  ArrayList<String> obj = (ArrayList<String>) parser.parse(targetEstimate.getUserMatching());
					obj.clear();
				  obj.add(matchingPlanner);
					targetEstimate.setPlannermatching(String.valueOf(obj));
					targetEstimate.setUserMatching(String.valueOf(obj));
					targetEstimate.setMatchstatus(true);

					List<PlannerProfileDTO> profiles = new ArrayList<PlannerProfileDTO>();
					PlannerProfileDTO targetPlannerData = plannerProfileService.getPlannerByEmail(matchingPlanner);
					profiles.add(targetPlannerData);
					targetEstimate.setPlannerProfiles(profiles);
				  estimateService.save(targetEstimate);

					return targetEstimate;
				
				}
				
				//매칭취소하기
				@PostMapping(value = "/matching/cancel")
				public int cancelMatching(@RequestParam("userEmail") String userEmail
						,@RequestParam("estimateId") Long EstimateId
						) throws Exception {

					  int res = 0;

						Estimate targetEstimate = estimateService.getEstimateDetail(EstimateId);
						ArrayList<String> cleanList= new ArrayList<>();
						targetEstimate.setPlannermatching(String.valueOf(cleanList));
						targetEstimate.setUserMatching(String.valueOf(cleanList));
						targetEstimate.setMatchstatus(false);
						estimateService.save(targetEstimate);
						Payment targetPayment = paymentRepository.findByEstimateId(EstimateId);
						if(targetPayment!=null) {
						  paymentRepository.delete(targetPayment);
						}

						res = 1;
						return res;
				
				}
				
				//플래너 요청, 고객요청 비교해서 서로 짝 찾기
				@PostMapping(value = "/findMatching")
				public List<String> findMatching(@RequestParam("email") String email
						,@RequestParam("category") String category
						) throws Exception {
					List<String> result = new ArrayList<>();
					if(category.equals("user")) {
						 
						List<Estimate> estimatesData = estimateService.getEstimateDetailByEmail(email);
						System.out.println(estimatesData.size());
						if(estimatesData!=null) {
							int k=0;
							for(int i =0;i<estimatesData.size();i++) {
								Estimate targetEstimate = estimatesData.get(i);
								JSONParser parser = new JSONParser();
								
								ArrayList<String> plannermatching = (ArrayList<String>) parser.parse(targetEstimate.getPlannermatching());
								ArrayList<String> usermatching = (ArrayList<String>) parser.parse(targetEstimate.getUserMatching());
								ArrayList<String> originPlannerMatching = (ArrayList<String>) parser.parse(targetEstimate.getPlannermatching());
								JSONArray temp = new JSONArray();
								if(plannermatching.size()!=0 && usermatching.size() !=0) {
									System.out.println(plannermatching);
									System.out.println(usermatching);
									
									System.out.println(originPlannerMatching.size());
									plannermatching.retainAll(usermatching);
									int m =0;
								
									if(plannermatching.size()!=0) {
										
										for(int l=0;l<originPlannerMatching.size();l++) {
											String str = originPlannerMatching.get(l);
											if(usermatching.contains(str)) {
												temp.add(str);
											
											}else {
												temp.add("empty");
												
											}
										}
									
										System.out.println("temp:"+temp);
									}
									
									
									if(plannermatching.size()!=0) {
										
										result.add(String.valueOf(temp));
										result.add(String.valueOf(k));
										
									}else {
										result.add(String.valueOf(new ArrayList<>()));
										result.add(String.valueOf(0));
										k++;
										continue;
									}
									
								}else {
									result.add(String.valueOf(new ArrayList<>()));
									result.add(String.valueOf(0));
								}
								
								k++;
							}
						}
						
					}else if(category.equals("planner")) {
						List<Estimate> estimatesData1 = estimateRepository.findAll();
					
						if(estimatesData1!=null) {
							int k= 0;
							for(int i =0;i<estimatesData1.size();i++) {
								Estimate targetEstimate = estimatesData1.get(i);
							
								JSONParser parser = new JSONParser();
								
								ArrayList<String> plannermatching = (ArrayList<String>) parser.parse(targetEstimate.getPlannermatching());
								ArrayList<String> usermatching = (ArrayList<String>) parser.parse(targetEstimate.getUserMatching());
								ArrayList<String> originUserMatching = usermatching;
								if(usermatching.contains(email)) {
									if(plannermatching.size()!=0 && usermatching.size() !=0) {
										if(plannermatching.contains(email) && usermatching.contains(email)) {
											System.out.println(plannermatching);
											System.out.println(usermatching);
											result.add(String.valueOf(k));
										}else {
											result.add(String.valueOf(-1));
											k++;
											continue;
										}
										
									}else {
										result.add(String.valueOf(-1));
									}
									k++;
									
								}
							
								
							}
						}
					}
					return result;
				
				}

				//리뷰 페이지로 이동하기1
				@PostMapping(value = "/review")
				public String getPlannerInfoForReview(@RequestParam("matchingPlanner") String plannerEmail, 
						@RequestParam("targetEstimateId") Long estimateId, @RequestParam("userEmail") String userEmail
						) throws Exception {
				    String result="";
				    List<Estimate> targetData = estimateService.getEstimateDetailByEmail(userEmail);
					Estimate targetEstimate = estimateService.getEstimateDetail(estimateId);

					UserUpdateDelete data = userService.getUserByEmail(userEmail);
					PlannerUpdateDelete plannerData = plannerService.getPlannerByEmail(plannerEmail);
					
					System.out.println(data.getName());
					String userName = data.getName()+"/";
					result= userName;
					System.out.println(data.getPhoneNum());
					String userPhone = data.getPhoneNum()+"]";
					result+= userPhone;

					String planneremail = plannerData.getEmail()+"[";
					result +=plannerEmail;
					String plannerName = plannerData.getName()+",";
					result+=plannerName;
					String price = targetEstimate.getBudget()+"*";
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
				    

					System.out.println("result"+result);
					return result;
				
				}
				
				//리뷰 페이지로 이동하기2
				@PostMapping(value = "/review2")
				public List<String> getPlannerInfoForReview2(@RequestParam("userEmail") String userEmail,@RequestParam("estimateNum") String estimateNum
						) throws Exception {
					List<Estimate> estimatesData = estimateRepository.findAllByWriter(userEmail);
			    	String searchedPlanner = "";
			    	List<String> encodingDatas = new ArrayList<>();
			    	Long estimateId = null;
			    	for(int i =0;i<estimatesData.size();i++) {
			    		if(i==Integer.parseInt(estimateNum)) {
			    			JSONParser parser = new JSONParser();
			    			ArrayList<String> plannerMatching = (ArrayList<String>) parser.parse(estimatesData.get(i).getPlannermatching());
			    			searchedPlanner = plannerMatching.get(0);
			    			estimateId = estimatesData.get(i).getId();
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
			        encodingDatas.add(String.valueOf(estimateId));
			        return encodingDatas;
				}

	@RequestMapping("/getsearchlistcount")
	public int getsearchlistcount(@RequestBody Map<String, Object> requestParams) {
		System.out.println("여기"+requestParams.get("search"));
		String search = (String)requestParams.get("search");
		return estimateService.getsearchlistcount(search);
	}
	
	
	//검색어도 보내야 하고 페이징을 위한 데이터 몇 개 가져올지 그것도 필요할듯.
	@RequestMapping("/getsearchlistpageing")
	public List<Estimate> getsearchlistpageing(@RequestBody Map<String,Object> requestParams){
		int page_num = (int)requestParams.get("page_num");
		int limit = (int)requestParams.get("limit");
		String search = (String)requestParams.get("search");
		return estimateService.getsearchlistpageing(page_num,limit,search);
	}

	
}


