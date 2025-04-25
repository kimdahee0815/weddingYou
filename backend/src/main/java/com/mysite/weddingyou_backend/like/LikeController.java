package com.mysite.weddingyou_backend.like;

import java.text.Collator;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Locale;
import java.util.HashMap;
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
	public List<Map<String, Object>> getLikeListByCategory(HttpServletRequest request, @RequestBody likeDTO data) {
    String email = data.getEmail();
    Category1 category1 = data.getCategory1();
    
    // 1. Get filtered like list
    List<likeDTO> likeList = likeService.getLikeListByCategory1(email, category1);

    // 2. Group by ItemId
    Map<Long, Map<String, Object>> groupedItems = new HashMap<>();
    
    for (likeDTO like : likeList) {
        Long itemId = like.getItem().getItemId();
        
        if (!groupedItems.containsKey(itemId)) {
            Map<String, Object> itemGroup = new HashMap<>();
            itemGroup.put("item", like.getItem());
            itemGroup.put("likeCount", likeService.getLikeCount(itemId));
            itemGroup.put("latestLikeDate", like.getLikeWriteDate());
            itemGroup.put("isLiked", true);
            
            groupedItems.put(itemId, itemGroup);
        } else {
            LocalDateTime existingDate = (LocalDateTime) groupedItems.get(itemId).get("latestLikeDate");
            if (like.getLikeWriteDate().isAfter(existingDate)) {
                groupedItems.get(itemId).put("latestLikeDate", like.getLikeWriteDate());
            }
        }
    }

    // 3. Convert to list and sort by date by default
    List<Map<String, Object>> result = new ArrayList<>(groupedItems.values());
    sortByDate(result);

    return result;
	}
	
	
	//정렬(가나다순, 인기순, 지역순)
	@PostMapping("/list/sort")
	public List<Map<String, Object>> getLikeListBySort(@RequestBody likeDTO data) {
    String sortBy = data.getSortBy();
    String email = data.getEmail();

    // 1. Get like list
    List<likeDTO> likeList = likeService.getLikeList(email);

    // 2. Group by ItemId
    Map<Long, Map<String, Object>> groupedItems = new HashMap<>();
    
    for (likeDTO like : likeList) {
        Long itemId = like.getItem().getItemId();
        
        if (!groupedItems.containsKey(itemId)) {
            Map<String, Object> itemGroup = new HashMap<>();
            itemGroup.put("item", like.getItem());
            itemGroup.put("likeCount", likeService.getLikeCount(itemId));
            itemGroup.put("latestLikeDate", like.getLikeWriteDate());
            itemGroup.put("isLiked", true);
            
            groupedItems.put(itemId, itemGroup);
        } else {
            LocalDateTime existingDate = (LocalDateTime) groupedItems.get(itemId).get("latestLikeDate");
            if (like.getLikeWriteDate().isAfter(existingDate)) {
                groupedItems.get(itemId).put("latestLikeDate", like.getLikeWriteDate());
            }
        }
    }

    // 3. Convert to list
    List<Map<String, Object>> result = new ArrayList<>(groupedItems.values());

    // 4. Sort
    sortGroupedItems(result, sortBy);

    return result;
	}
	
	@PostMapping("/list/category/sort")
	public List<Map<String, Object>> getLikeListByCategoryAndSort(@RequestBody likeDTO data) {
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

		// 2. Group by ItemId
		Map<Long, Map<String, Object>> groupedItems = new HashMap<>();
    
    for (likeDTO like : likeList) {
        Long itemId = like.getItem().getItemId();
        
        if (!groupedItems.containsKey(itemId)) {
            Map<String, Object> itemGroup = new HashMap<>();
            itemGroup.put("item", like.getItem());
            itemGroup.put("likeCount", likeService.getLikeCount(itemId));
            itemGroup.put("latestLikeDate", like.getLikeWriteDate());
            itemGroup.put("isLiked", true);
            
            groupedItems.put(itemId, itemGroup);
        } else {
            LocalDateTime existingDate = (LocalDateTime) groupedItems.get(itemId).get("latestLikeDate");
            if (like.getLikeWriteDate().isAfter(existingDate)) {
                groupedItems.get(itemId).put("latestLikeDate", like.getLikeWriteDate());
            }
        }
    }

		// 3. Convert to list
    List<Map<String, Object>> result = new ArrayList<>(groupedItems.values());

    // 2. sort
    sortGroupedItems(result, sortBy);

    return result;
	}

	private void sortGroupedItems(List<Map<String, Object>> result, String sortBy) {
    if (sortBy == null) return;

    switch (sortBy) {
        case "가나다순":
            sortByName(result);
            break;
        case "인기순":
            sortByLikeCount(result);
            break;
        case "최신순":
        case "정렬":
        default:
            sortByDate(result);
            break;
    }
	}

	private void sortByName(List<Map<String, Object>> items) {
    Collator koreanCollator = Collator.getInstance(Locale.KOREAN); 
    
    items.sort((a, b) -> {
        String nameA = ((Item)a.get("item")).getItemName().toLowerCase();
        String nameB = ((Item)b.get("item")).getItemName().toLowerCase();
        return koreanCollator.compare(nameA, nameB); 
    });
	}

	private void sortByLikeCount(List<Map<String, Object>> items) {
		Collator koreanCollator = Collator.getInstance(Locale.KOREAN);
    
    items.sort((a, b) -> {
        Integer countA = (Integer)a.get("likeCount");
        Integer countB = (Integer)b.get("likeCount");
        if (!countA.equals(countB)) {
            return countB.compareTo(countA); 
        }

        String nameA = ((Item)a.get("item")).getItemName().toLowerCase();
        String nameB = ((Item)b.get("item")).getItemName().toLowerCase();
        return koreanCollator.compare(nameA, nameB);
    });
	}

	private void sortByDate(List<Map<String, Object>> items) {
    items.sort((a, b) -> ((LocalDateTime)b.get("latestLikeDate"))
        .compareTo((LocalDateTime)a.get("latestLikeDate")));
	}
	

}