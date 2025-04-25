package com.mysite.weddingyou_backend.like;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mysite.weddingyou_backend.item.Item;
import com.mysite.weddingyou_backend.item.Item.Category1;
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
	
	@RequestMapping("/list")
    public List<LikeEntity> getLikeList(@RequestBody likeDTO user, HttpServletRequest request) {
		String email = user.getEmail();
    List<LikeEntity> likeList = likeService.getLikeList(email);

    return likeList;
  }
	
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
				 		// Add like with proper bidirectional relationship
				 		likeService.addLike(likeEntity, item);

            return ResponseEntity.ok(newLikeCount);
        }			
    } else if (plannerRepository.findByEmail(email) != null) {
        PlannerLogin planner = plannerRepository.findByEmail(email);
        likeEntity.setPlanner(planner);
        likeEntity.setItem(item);

        if (likeService.checkDuplicatedUserAndItem(likeEntity) == 0) {
            List<LikeEntity> list = likeService.getLikeListByItemId(itemId);
            newLikeCount = list.size() + 1;          
            // Add like with proper bidirectional relationship 
						likeService.addLike(likeEntity, item);
            
            return ResponseEntity.ok(newLikeCount);
        }
    }

    return ResponseEntity.badRequest().build();
	}
	
	@Transactional
	@PostMapping("/delete")
	public ResponseEntity<Void> deleteLike( @RequestBody likeDTO data) {
		Long itemId = data.getItemId();
    String email = data.getEmail();
    Item item = itemService.getItemById(itemId);
    
    if (userRepository.findByEmail(email) != null) {
        UserLogin user = userRepository.findByEmail(email);
        List<LikeEntity> likeItems = likeService.getLikeListByItemIdAndUser(user, item);
        
				likeService.deleteLike(likeItems.get(0).getLikeId());
    } else if (plannerRepository.findByEmail(email) != null) {
        PlannerLogin planner = plannerRepository.findByEmail(email);
        List<LikeEntity> likeItems = likeService.getLikeListByItemIdAndPlanner(planner, item);
        
        likeService.deleteLike(likeItems.get(0).getLikeId());
    }

    return ResponseEntity.ok().build();
	}

	@GetMapping("/item/{itemId}/likeCount")
	public ResponseEntity<Integer> getLikeCount(@PathVariable Long itemId) {
		int likeCount = likeService.getLikeCount(itemId);
    
    return ResponseEntity.ok(likeCount);
	}

	@PostMapping("/item/likeCounts")
	public ResponseEntity<Map<Long, Integer>> getLikeCounts(@RequestBody List<Long> itemIds) {
    Map<Long, Integer> likeCounts = likeService.getLikeCounts(itemIds);

    return ResponseEntity.ok(likeCounts);
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
		
			if(likeItem.size()!=0) {
				res = 1;
			}else {
				res = 0;
			}
		}else if(plannerRepository.findByEmail(email)!=null) {
			PlannerLogin planner = plannerRepository.findByEmail(email);
			likeItem = likeService.getLikeListByItemIdAndPlanner(planner, item);
			
			if(likeItem.size()!=0) {
				res = 1;
			}else  {
				res = 0;
			}
		
		}
	
		return res;
	}
	
	@PostMapping("/list/category")
	public List<LikeEntity> getLikeListByCategory(HttpServletRequest request, @RequestBody likeDTO data) {
		String email =data.getEmail();
		Category1 category1 = data.getCategory1();
		
		return likeService.getLikeListByCategory1(email, category1);
	}
	
	
	//정렬(가나다순, 인기순, 지역순)
	@PostMapping("/list/sort")
	public List<LikeEntity> getLikeListBySort(@RequestBody likeDTO data, HttpServletRequest request) {
		String sortBy = data.getSortBy();
		String email = data.getEmail();

		List<LikeEntity> likeList = likeService.getLikeList(email);
	  if (sortBy != null) {
	    switch (sortBy) {
	      case "가나다순": //asc
	        Collections.sort(likeList, (a, b) -> b.getItem().getItemName().compareTo(a.getItem().getItemName()));
	        break;
	      case "인기순": //desc
					Collections.sort(likeList, new Comparator<LikeEntity>() {
            public int compare(LikeEntity o1, LikeEntity o2) {
							int o1LikeCount = likeService.getLikeCount(o1.getItem().getItemId());
							int o2LikeCount = likeService.getLikeCount(o2.getItem().getItemId());
              String o1ItemName = o1.getItem().getItemName();
							String o2ItemName = o2.getItem().getItemName();
							if(o1LikeCount - o2LikeCount>0) {
                return 1;
              }else if(o1LikeCount - o2LikeCount<0) {
                return -1;
							}else {
                if(o1ItemName.compareTo(o2ItemName)>0) {
                  return -1;
                }else if(o1ItemName.compareTo(o2ItemName)<0) {
                  return 1;
                }else {
                  return 0;
                }
              }
						}
          });
          break;
//      case "지역순": //오름차순
//	      Collections.sort(likeList, (a, b) -> a.getLocation().compareTo(b.getLocation()));
//        break;
	      default:
          throw new IllegalArgumentException("Invalid sort option: " + sortBy);
	    }
	  }
	  return likeList;
	}
	
		//정렬(가나다순, 인기순, 지역순)
		@PostMapping("/list/category/sort")
		public List<LikeEntity> getLikeListByCategoryAndSort(@RequestBody likeDTO data, HttpServletRequest request) {
			String sortBy = data.getSortBy();
			Category1 category1 = data.getCategory1();		
			String email = data.getEmail();

			List<LikeEntity> likeList = null; 
			if(category1.toString().equals("카테고리") && sortBy.equals("정렬") || category1.toString().equals("전체") && sortBy.equals("정렬")) { //초기상태
				likeList = likeService.getLikeList(email);
			}
			if(category1.toString().equals("카테고리") && !sortBy.equals("정렬") || category1.toString().equals("전체") && !sortBy.equals("정렬")) { //정렬만 선택했을 때
				likeList = likeService.getLikeList(email);
				if (sortBy != null) {
				  switch (sortBy) {
				    case "가나다순": //asc
				      Collections.sort(likeList, (a, b) -> a.getItem().getItemName().compareTo(b.getItem().getItemName()));
				      break;
				    case "인기순": //desc
			        Collections.sort(likeList, new Comparator<LikeEntity>() {
			          public int compare(LikeEntity o1, LikeEntity o2) {
									int o1LikeCount = likeService.getLikeCount(o1.getItem().getItemId());
									int o2LikeCount = likeService.getLikeCount(o2.getItem().getItemId());
              		String o1ItemName = o1.getItem().getItemName();
									String o2ItemName = o2.getItem().getItemName();
			            if(o1LikeCount - o2LikeCount >0) {
			              return -1;
			            }else if(o1LikeCount - o2LikeCount <0) {
			              return 1;
			            }else {
			              if(o1ItemName.compareTo(o2ItemName)>0) {
			                return 1;
			              }else if(o1ItemName.compareTo(o2ItemName)<0) {
			                return -1;
			              }else {
			                return 0;
			              }
			            }
			          }
			        });
			        break;
			      case "최신순": //asc
			        Collections.sort(likeList, (a, b) -> b.getLikeWriteDate().compareTo(a.getLikeWriteDate()));
			        break;	                
			      case "정렬":
			        Collections.sort(likeList, (a, b) -> b.getLikeWriteDate().compareTo(a.getLikeWriteDate()));
			        break;
				    default:
			        throw new IllegalArgumentException("Invalid sort option: " + sortBy);
				  }
				}
			}

			if(category1.toString().equals("웨딩홀") && sortBy.equals("정렬") || category1.toString().equals("스튜디오") && sortBy.equals("정렬") 
		|| category1.toString().equals("의상") && sortBy.equals("정렬") || category1.toString().equals("메이크업") && sortBy.equals("정렬") 
		|| category1.toString().equals("신혼여행") && sortBy.equals("정렬") || category1.toString().equals("부케") && sortBy.equals("정렬") ) { // 카테고리만 선택했을 때
				likeList = likeService.getLikeListByCategory1(email, category1);
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
										int o1LikeCount = likeService.getLikeCount(o1.getItem().getItemId());
										int o2LikeCount = likeService.getLikeCount(o2.getItem().getItemId());
              			String o1ItemName = o1.getItem().getItemName();
										String o2ItemName = o2.getItem().getItemName();
			              if(o1LikeCount - o2LikeCount >0) {
			                return -1;
			              }else if(o1LikeCount - o2LikeCount <0) {
			                return 1;
			              }else {
			                if(o1ItemName.compareTo(o2ItemName)>0) {
			                  return 1;
			                }else if(o1ItemName.compareTo(o2ItemName)<0) {
			                  return -1;
			                }else {
			                  return 0;
			                }
			              }
			            }
			        	});
			          break;
			        case "최신순": //asc
			          Collections.sort(likeList, (a, b) -> b.getLikeWriteDate().compareTo(a.getLikeWriteDate()));
			          break;
			        case "정렬":
			          Collections.sort(likeList, (a, b) -> b.getLikeWriteDate().compareTo(a.getLikeWriteDate()));
			          break;
				      default:
			          throw new IllegalArgumentException("Invalid sort option: " + sortBy);
				    }
				  }
				}
			}
		  return likeList;
		}
	

}