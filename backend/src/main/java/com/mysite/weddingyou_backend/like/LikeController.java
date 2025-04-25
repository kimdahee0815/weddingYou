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
    public List<likeDTO> getLikeList(@RequestBody likeDTO user, HttpServletRequest request) {
		String email = user.getEmail();
    List<likeDTO> likeList = likeService.getLikeList(email);

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
	public List<likeDTO> getLikeListByCategory(HttpServletRequest request, @RequestBody likeDTO data) {
		String email =data.getEmail();
		Category1 category1 = data.getCategory1();
		
		return likeService.getLikeListByCategory1(email, category1);
	}
	
	
	//정렬(가나다순, 인기순, 지역순)
	@PostMapping("/list/sort")
	public List<likeDTO> getLikeListBySort(@RequestBody likeDTO data) {
    String sortBy = data.getSortBy();
    String email = data.getEmail();

    List<likeDTO> likeList = likeService.getLikeList(email);
    sortLikeList(likeList, sortBy);

    return likeList;
	}
	
	@PostMapping("/list/category/sort")
	public List<likeDTO> getLikeListByCategoryAndSort(@RequestBody likeDTO data) {
    String sortBy = data.getSortBy();
    Category1 category1 = data.getCategory1();
    String email = data.getEmail();

    boolean isDefaultCategory = category1.toString().equals("카테고리") || category1.toString().equals("전체");
    boolean isDefaultSort = sortBy.equals("정렬");

    List<likeDTO> likeList;

    // 1. filtering
    if (isDefaultCategory) {
        likeList = likeService.getLikeList(email);
    } else {
        likeList = likeService.getLikeListByCategory1(email, category1);
    }

    // 2. sort
    sortLikeList(likeList, sortBy);

    return likeList;
	}

	private void sortLikeList(List<likeDTO> likeList, String sortBy) {
    if (sortBy == null) return;
		
		switch (sortBy) {
        case "가나다순":
            likeList.sort(Comparator.comparing(like -> like.getItem().getItemName()));
            break;
        case "인기순":
            likeList.sort((o1, o2) -> {
                int o1Count = likeService.getLikeCount(o1.getItem().getItemId());
                int o2Count = likeService.getLikeCount(o2.getItem().getItemId());

                if (o1Count != o2Count) {
                    return Integer.compare(o2Count, o1Count); // like (desc)
                }

                return o1.getItem().getItemName().compareTo(o2.getItem().getItemName()); // name (asc) 
            });
            break;
        case "최신순":
        case "정렬": // default is also recent order
        default:
            likeList.sort(Comparator.comparing(likeDTO::getLikeWriteDate).reversed());
            break;
    }
	}
	

}