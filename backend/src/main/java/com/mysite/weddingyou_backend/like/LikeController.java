package com.mysite.weddingyou_backend.like;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mysite.weddingyou_backend.item.Item;
import com.mysite.weddingyou_backend.item.Item.Category1;
import com.mysite.weddingyou_backend.item.Item.Category2;
import com.mysite.weddingyou_backend.item.ItemRepository;
import com.mysite.weddingyou_backend.item.ItemService;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLogin;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLoginRepository;
import com.mysite.weddingyou_backend.userLogin.UserLogin;
import com.mysite.weddingyou_backend.userLogin.UserLoginRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/like")
public class LikeController {
	
	@Autowired
	LikeService likeService;
	
	@Autowired
	private UserLoginRepository userRepository;
	
	@Autowired
	private PlannerLoginRepository plannerRepository;
	
	@Autowired
	private ItemRepository itemRepository;

	@Autowired
	private ItemService itemService;
	
	//찜목록 조회
	@RequestMapping("/list")
    public List<LikeEntity> getLikeList(@RequestBody likeDTO user, HttpServletRequest request) {
       // HttpSession session = request.getSession();
       // UserLogin loggedInUser = (UserLogin) session.getAttribute("loggedInUser");
		String email = user.getEmail();
		
    List<LikeEntity> likeList = likeService.getLikeList(email);
     
       
    //     List<String> encodingDatas = new ArrayList<>();
        
        
    // if(likeList!=null) {
    // 	for(int i =0;i<likeList.size();i++) {
    // 		Item targetItem = likeList.get(i).getItem();
    // 		targetItem.setLikeWriteDate(likeList.get(i).getLikeWriteDate());
    // 		itemRepository.save(targetItem);
    // 		Category2 category2 = targetItem.getCategory2();
    		
	  //   	 String path = "C:/Project/itemImg/"+targetItem.getCategory1()+"/"+category2;
	  //   	 Path imagePath = Paths.get(path,targetItem.getItemImg());
	  //   	 System.out.println(imagePath);

	  //        try {
	  //            byte[] imageBytes = Files.readAllBytes(imagePath);
	  //            byte[] base64encodedData = Base64.getEncoder().encode(imageBytes);
	             
	  //            encodingDatas.add(new String(base64encodedData));
	             
	  //        } catch (IOException e) {
	  //            e.printStackTrace();
	            
	  //        }
	  //       encodingDatas.add(String.valueOf(targetItem.getItemId()));
	  //       encodingDatas.add(String.valueOf(likeList.get(i).getLikeWriteDate()));
    // 	}
    	
    // }
    return likeList;
    
    }
	
	//좋아요 생성
	@Transactional
	@PostMapping("/create")
	public ResponseEntity<Integer> createLike(HttpServletRequest request, @RequestBody likeDTO user ) {
		Long itemId = user.getItemId();
    String email = user.getEmail();
    LikeEntity likeEntity = new LikeEntity();
    
    Item item = itemService.getItemById(itemId);
    
    int newLikeCount = 0;
    
    if (userRepository.findByEmail(email) != null) {
        UserLogin userLogin = userRepository.findByEmail(email);
        likeEntity.setUser(userLogin);
				likeEntity.setItem(item);

        if (likeService.checkDuplicatedUserAndItem(likeEntity) == 0) {
            List<LikeEntity> list = likeService.getLikeListByItemId(itemId);
            newLikeCount = list.size() + 1;
            likeEntity.setLikeCount(newLikeCount);
				 		// Add like with proper bidirectional relationship
				 		likeService.addLike(likeEntity, item);
           
            return ResponseEntity.ok(newLikeCount);

        }
				
    } else if (plannerRepository.findByEmail(email) != null) {
        PlannerLogin planner = plannerRepository.findByEmail(email);
        likeEntity.setPlanner(planner);
        likeEntity.setItem(item);

        if (likeService.checkDuplicatedPlannerAndItem(likeEntity) == 0) {
            List<LikeEntity> list = likeService.getLikeListByItemId(itemId);
            newLikeCount = list.size() + 1;
            likeEntity.setLikeCount(newLikeCount);
            
            // Add like with proper bidirectional relationship 
						likeService.addLike(likeEntity, item);
            
            return ResponseEntity.ok(newLikeCount);
        }
    }

    return ResponseEntity.badRequest().build();
	}
	
	//좋아요 삭제
	@PostMapping("/delete")
	public ResponseEntity<Void> deleteLike( @RequestBody likeDTO data) {
		Long itemId = data.getItemId();
    String email = data.getEmail();
    
    Item item = itemService.getItemById(itemId);
    
    if (userRepository.findByEmail(email) != null) {
        UserLogin user = userRepository.findByEmail(email);
        List<LikeEntity> likeItems = likeService.getLikeListByItemIdAndUser(user, item);
        
        if (!likeItems.isEmpty() && likeItems.get(0).getLikeCount() == 1) {
          likeService.deleteLike(likeItems.get(0).getLikeId());
        }else if(likeItems.get(0).getLikeCount() != 1){
					likeService.decreaseLikeNum(likeItems);
				}
    } else if (plannerRepository.findByEmail(email) != null) {
        PlannerLogin planner = plannerRepository.findByEmail(email);
        List<LikeEntity> likeItems = likeService.getLikeListByItemIdAndPlanner(planner, item);
        
        if (!likeItems.isEmpty() && likeItems.get(0).getLikeCount() == 1) {
          likeService.deleteLike(likeItems.get(0).getLikeId());
        }else if(likeItems.get(0).getLikeCount() != 1){
					likeService.decreaseLikeNum(likeItems);
				}
    }

    return ResponseEntity.ok().build();
	}
	
	
	@RequestMapping("/findlist")
	public int findLikeListByUserAndItem(@RequestBody likeDTO data){
		Long itemId = data.getItemId();
		String email = data.getEmail();
		
		Item item = itemService.getItemById(itemId);
		
		int res = -1;
		
		if(email==null) {
			return -1;
		}
		
		List<LikeEntity> likeItem = new ArrayList<>();
		if(userRepository.findByEmail(email)!=null) {
			UserLogin user = userRepository.findByEmail(email);
			likeItem = likeService.getLikeListByItemIdAndUser(user, item);
		
			if(likeItem.size()!=0) { //찾은 결과가 있을 때
				res = 1;
				System.out.println("=========================="+likeItem.get(0).getItem().getItemId());
			}else {
				res = 0;
			}
		}else if(plannerRepository.findByEmail(email)!=null) {
			PlannerLogin planner = plannerRepository.findByEmail(email);
			likeItem = likeService.getLikeListByItemIdAndPlanner(planner, item);
			
			if(likeItem.size()!=0) {
				res = 1;
				System.out.println("================================="+likeItem.get(0).getItem().getItemId());
			}else  {
				res = 0;
			}
		
		}
	
		return res;
	}
	//필터링
	@PostMapping("/list/category")
	public List<String> getLikeListByCategory(HttpServletRequest request, @RequestBody likeDTO data) {
	   // HttpSession session = request.getSession();
	   // UserLogin loggedInUser = (UserLogin) session.getAttribute("loggedInUser");
	   // List<LikeEntity> likeList = likeService.getLikeListByCategory(loggedInUser.getEmail(), category1, category2);
		String email =data.getEmail();
		Category1 category1 = data.getCategory1();
		System.out.println(category1.toString());
		if(category1.toString().equals("전체")) {
		
	        List<LikeEntity> likeList = likeService.getLikeList(email);
	        
	        List<String> encodingDatas = new ArrayList<>();
	        
	    if(likeList!=null) {
	    	for(int i =0;i<likeList.size();i++) {
	    		Item targetItem = likeList.get(i).getItem();
	    		targetItem.setLikeWriteDate(likeList.get(i).getLikeWriteDate());
	    		itemRepository.save(targetItem);
	    		Category2 category2 = targetItem.getCategory2();
	    		
		    	 String path = "C:/Project/itemImg/"+targetItem.getCategory1()+"/"+category2;
		    	 Path imagePath = Paths.get(path,targetItem.getItemImg());
		    	 System.out.println(imagePath);

		         try {
		             byte[] imageBytes = Files.readAllBytes(imagePath);
		             byte[] base64encodedData = Base64.getEncoder().encode(imageBytes);
		             
		             encodingDatas.add(new String(base64encodedData));
		             
		         } catch (IOException e) {
		             e.printStackTrace();
		            
		         }
		        encodingDatas.add(String.valueOf(targetItem.getItemId()));
		        encodingDatas.add(String.valueOf(likeList.get(i).getLikeWriteDate()));
		        System.out.println(targetItem.getItemId());
	    	}
	    	
	    }
	    return encodingDatas;
		}
		
		List<LikeEntity> likeList = likeService.getLikeListByCategory1(email, category1);
	    
		 List<String> encodingDatas = new ArrayList<>();
	        
		    if(likeList!=null) {
		    	for(int i =0;i<likeList.size();i++) {
		    		Item targetItem = likeList.get(i).getItem();
		    		targetItem.setLikeWriteDate(likeList.get(i).getLikeWriteDate());
		    		itemRepository.save(targetItem);
		    		
		    		
			    	 String path = "C:/Project/itemImg/"+targetItem.getCategory1()+"/"+targetItem.getCategory2();
			    	 Path imagePath = Paths.get(path,targetItem.getItemImg());
			    	 System.out.println(imagePath);

			         try {
			             byte[] imageBytes = Files.readAllBytes(imagePath);
			             byte[] base64encodedData = Base64.getEncoder().encode(imageBytes);
			             
			             encodingDatas.add(new String(base64encodedData));
			             
			         } catch (IOException e) {
			             e.printStackTrace();
			            
			         }
			        encodingDatas.add(String.valueOf(targetItem.getItemId()));
			        encodingDatas.add(String.valueOf(likeList.get(i).getLikeWriteDate()));
			        System.out.println(targetItem.getItemId());
		    	}
		    	
		    }
		    return encodingDatas;
	
	}
	
	
	//정렬(가나다순, 인기순, 지역순)
	@PostMapping("/list/sort")
	public List<String> getLikeListBySort(@RequestBody likeDTO data, HttpServletRequest request) {
	  //  HttpSession session = request.getSession();
	  //  UserLogin loggedInUser = (UserLogin) session.getAttribute("loggedInUser");
	  //  List<LikeEntity> likeList = likeService.getLikeList(loggedInUser.getEmail());
		String sortBy = data.getSortBy();
		System.out.println(sortBy);
		String email = data.getEmail();
		List<LikeEntity> likeList = likeService.getLikeList(email);
	    if (sortBy != null) {
	        switch (sortBy) {
	            case "가나다순": //오름차순
	            	Collections.sort(likeList, (a, b) -> b.getItem().getItemName().compareTo(a.getItem().getItemName()));
	                break;
	            case "인기순": //내림차순
            	Collections.sort(likeList, new Comparator<LikeEntity>() {
                    public int compare(LikeEntity o1, LikeEntity o2) {
                    	if(o1.getLikeCount() - o2.getLikeCount()>0) {
                    		return 1;
                    	}else if(o1.getLikeCount() - o2.getLikeCount()<0) {
                    		return -1;
                    	}else {
                    		if(o1.getItem().getItemName().compareTo(o2.getItem().getItemName())>0) {
                    			return -1;
                    		}else if(o1.getItem().getItemName().compareTo(o2.getItem().getItemName())<0) {
                    			return 1;
                    		}else {
                    			return 0;
                    		}
                    	}
                        
                    }
            	});
                break;
//            case "지역순": //오름차순
//	                Collections.sort(likeList, (a, b) -> a.getLocation().compareTo(b.getLocation()));
//                break;
	            default:
	                // 예외 처리
                throw new IllegalArgumentException("Invalid sort option: " + sortBy);
	        }
	    }
	    List<String> encodingDatas = new ArrayList<>();
        
	    if(likeList!=null) {
	    	for(int i =0;i<likeList.size();i++) {
	    		Item targetItem = likeList.get(i).getItem();
	    		targetItem.setLikeWriteDate(likeList.get(i).getLikeWriteDate());
	    		itemRepository.save(targetItem);
	    		
	    		
		    	 String path = "C:/Project/itemImg/"+targetItem.getCategory1()+"/"+targetItem.getCategory2();
		    	 Path imagePath = Paths.get(path,targetItem.getItemImg());
		    	 System.out.println(imagePath);

		         try {
		             byte[] imageBytes = Files.readAllBytes(imagePath);
		             byte[] base64encodedData = Base64.getEncoder().encode(imageBytes);
		             
		             encodingDatas.add(new String(base64encodedData));
		             
		         } catch (IOException e) {
		             e.printStackTrace();
		            
		         }
		        encodingDatas.add(String.valueOf(targetItem.getItemId()));
		       // encodingDatas.add(String.valueOf(likeList.get(i).getLikeWriteDate()));
		        System.out.println(targetItem.getItemId());
	    	}
	    	
	    }
	    return encodingDatas;
	}
	
	//정렬(가나다순, 인기순, 지역순)
		@PostMapping("/list/category/sort")
		public List<String> getLikeListByCategoryAndSort(@RequestBody likeDTO data, HttpServletRequest request) {
		  //  HttpSession session = request.getSession();
		  //  UserLogin loggedInUser = (UserLogin) session.getAttribute("loggedInUser");
		  //  List<LikeEntity> likeList = likeService.getLikeList(loggedInUser.getEmail());
			String sortBy = data.getSortBy();
			Category1 category1 = data.getCategory1();
			
			String email = data.getEmail();
			List<LikeEntity> likeList = null; 
			if(category1.toString().equals("카테고리") && sortBy.equals("정렬") || category1.toString().equals("전체") && sortBy.equals("정렬")) { //초기상태
					likeList = likeService.getLikeList(email);
					  Collections.sort(likeList, (a, b) -> b.getLikeWriteDate().compareTo(a.getLikeWriteDate()));
			   
			}
			if(category1.toString().equals("카테고리") && !sortBy.equals("정렬") || category1.toString().equals("전체") && !sortBy.equals("정렬")) { //정렬만 선택했을 때
				likeList = likeService.getLikeList(email);
				if (sortBy != null) {
				        switch (sortBy) {
				            case "가나다순": //오름차순
				            	Collections.sort(likeList, (a, b) -> a.getItem().getItemName().compareTo(b.getItem().getItemName()));
				                break;
				            case "인기순": //내림차순
			            	Collections.sort(likeList, new Comparator<LikeEntity>() {
			                    public int compare(LikeEntity o1, LikeEntity o2) {
			                    	if(o1.getLikeCount() - o2.getLikeCount()>0) {
			                    		return -1;
			                    	}else if(o1.getLikeCount() - o2.getLikeCount()<0) {
			                    		return 1;
			                    	}else {
			                    		if(o1.getItem().getItemName().compareTo(o2.getItem().getItemName())>0) {
			                    			return 1;
			                    		}else if(o1.getItem().getItemName().compareTo(o2.getItem().getItemName())<0) {
			                    			return -1;
			                    		}else {
			                    			return 0;
			                    		}
			                    	}
			                        
			                    }
			            	});
			                break;
			            case "최신순": //오름차순
			            	Collections.sort(likeList, (a, b) -> b.getLikeWriteDate().compareTo(a.getLikeWriteDate()));
			                break;
//			                
			            case "정렬":
			            Collections.sort(likeList, (a, b) -> b.getLikeWriteDate().compareTo(a.getLikeWriteDate()));
			            break;
				            default:
				                // 예외 처리
			                throw new IllegalArgumentException("Invalid sort option: " + sortBy);
				        }
				    }
				
			}
			if(category1.toString().equals("웨딩홀") && sortBy.equals("정렬") || category1.toString().equals("스튜디오") && sortBy.equals("정렬") 
		|| category1.toString().equals("의상") && sortBy.equals("정렬") || category1.toString().equals("메이크업") && sortBy.equals("정렬") 
		|| category1.toString().equals("신혼여행") && sortBy.equals("정렬") || category1.toString().equals("부케") && sortBy.equals("정렬") ) { // 카테고리만 선택했을 때
				likeList = likeService.getLikeListByCategory1(email, category1);
				  Collections.sort(likeList, (a, b) -> b.getLikeWriteDate().compareTo(a.getLikeWriteDate()));
			}
			
			if(!sortBy.equals("정렬")) { //두조건 모두 선택되었을 때
				if(!category1.toString().equals("전체") && !category1.toString().equals("카테고리")) {
					likeList = likeService.getLikeListByCategory1(email, category1);
					
					if (sortBy != null) {
				        switch (sortBy) {
				            case "가나다순": //오름차순
				            	Collections.sort(likeList, (a, b) -> a.getItem().getItemName().compareTo(b.getItem().getItemName()));
				                break;
				            case "인기순": //내림차순
			            	Collections.sort(likeList, new Comparator<LikeEntity>() {
			                    public int compare(LikeEntity o1, LikeEntity o2) {
			                    	if(o1.getLikeCount() - o2.getLikeCount()>0) {
			                    		return -1;
			                    	}else if(o1.getLikeCount() - o2.getLikeCount()<0) {
			                    		return 1;
			                    	}else {
			                    		if(o1.getItem().getItemName().compareTo(o2.getItem().getItemName())>0) {
			                    			return 1;
			                    		}else if(o1.getItem().getItemName().compareTo(o2.getItem().getItemName())<0) {
			                    			return -1;
			                    		}else {
			                    			return 0;
			                    		}
			                    	}
			                        
			                    }
			            	});
			                break;
			            case "최신순": //오름차순
			            	Collections.sort(likeList, (a, b) -> b.getLikeWriteDate().compareTo(a.getLikeWriteDate()));
			                break;
			            case "정렬":
			            	  Collections.sort(likeList, (a, b) -> b.getLikeWriteDate().compareTo(a.getLikeWriteDate()));
			            	  break;
				            default:
				                // 예외 처리
			                throw new IllegalArgumentException("Invalid sort option: " + sortBy);
				        }
				    }
				}
			}
			
		    List<String> encodingDatas = new ArrayList<>();
	        
		    if(likeList!=null) {
		    	for(int i =0;i<likeList.size();i++) {
		    		Item targetItem = likeList.get(i).getItem();
		    		targetItem.setLikeWriteDate(likeList.get(i).getLikeWriteDate());
		    		itemRepository.save(targetItem);
		    		
		    		
			    	 String path = "C:/Project/itemImg/"+targetItem.getCategory1()+"/"+targetItem.getCategory2();
			    	 Path imagePath = Paths.get(path,targetItem.getItemImg());
			    	 System.out.println(imagePath);

			         try {
			             byte[] imageBytes = Files.readAllBytes(imagePath);
			             byte[] base64encodedData = Base64.getEncoder().encode(imageBytes);
			             
			             encodingDatas.add(new String(base64encodedData));
			             
			         } catch (IOException e) {
			             e.printStackTrace();
			            
			         }
			        encodingDatas.add(String.valueOf(targetItem.getItemId()));
			      //  encodingDatas.add(String.valueOf(likeList.get(i).getLikeWriteDate()));
			        System.out.println(targetItem.getItemId());
		    	}
		    	
		    }
		    return encodingDatas;
		}
	

}