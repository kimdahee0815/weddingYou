package com.mysite.weddingyou_backend.like;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mysite.weddingyou_backend.item.Item;
import com.mysite.weddingyou_backend.item.Item.Category1;
import com.mysite.weddingyou_backend.item.Item.Category2;
import com.mysite.weddingyou_backend.item.ItemRepository;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLogin;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLoginRepository;
import com.mysite.weddingyou_backend.userLogin.UserLogin;
import com.mysite.weddingyou_backend.userLogin.UserLoginRepository;


@Service
@Transactional
public class LikeService {
	
	@Autowired
	LikeRepository likeRepository;
	
	@Autowired
	UserLoginRepository userRepository;
	
	@Autowired
	PlannerLoginRepository plannerRepository;
	
	@Autowired
	ItemRepository itemRepository;
	
	//찜목록 조회
	public List<LikeEntity> getLikeList(String email) {
	   UserLogin user = new UserLogin();
	   PlannerLogin planner = new PlannerLogin();
	   if(userRepository.findByEmail(email)!=null) {
		   user.setEmail(email);
		   return likeRepository.findByUser(user);
	   }else {
		   planner.setEmail(email);
		   return likeRepository.findByPlanner(planner);
	   }
	   
	   
        
    }

	//좋아요 추가
    public void addLike(LikeEntity likeEntity, Item item) {
    likeEntity.setLikeWriteDate(LocalDateTime.now());
    likeEntity.setLocation("location");
    item.setLikeWriteDate(LocalDateTime.now());
		item.addLike(likeEntity);

    likeRepository.save(likeEntity);      
    }
    
    //유저와 item 중복 확인
    public int checkDuplicatedUserAndItem(LikeEntity likeEntity) {
    	if (likeEntity.getItem() == null) {
      	return 1; 
    	}

  		if (likeEntity.getUser() != null) {
        return likeRepository.existsByUserAndItem(likeEntity.getUser(), likeEntity.getItem()) ? 1 : 0;
    	} else if (likeEntity.getPlanner() != null) {
        return likeRepository.existsByPlannerAndItem(likeEntity.getPlanner(), likeEntity.getItem()) ? 1 : 0;
    	}

    	return 1;
    }
    
  //플래너와 item 중복 확인
    public int checkDuplicatedPlannerAndItem(LikeEntity likeEntity) {
    	List<LikeEntity> likeEntities = likeRepository.findAllByPlannerAndItem(likeEntity.getPlanner(), likeEntity.getItem());
    	System.out.println(likeEntities);
    	if(likeEntities.size() !=0) { // 중복
    		return 1;
    	}else { //중복되지 않음
    		return 0; 
    	}
    }

    //좋아요 삭제
    public void deleteLike(Long likeId) {
      likeRepository.deleteById(likeId);
    }
    
    //필터링
    public List<LikeEntity> getLikeListByCategory(String email, Category1 category1, Category2 category2) {
    	UserLogin user = new UserLogin();
 	   user.setEmail(email);
 
        return likeRepository.findByUserAndItem_Category1AndItem_Category2(user, category1, category2);
    }
    
    //필터링
    public List<LikeEntity> getLikeListByCategory1(String email, Category1 category1) {
    	List<LikeEntity> likeList = null;
    	if(userRepository.findByEmail(email)!=null) {
    		UserLogin user = new UserLogin();
    	 	   user.setEmail(email);
    	 	  return likeRepository.findByUserAndItem_Category1(user, category1);
    	}else if (plannerRepository.findByEmail(email)!=null) {
    		PlannerLogin planner = new PlannerLogin();
    	 	   planner.setEmail(email);
    	 	  return likeRepository.findByPlannerAndItem_Category1(planner, category1);
    	}
    	return likeList;
        
    }
    
    public List<LikeEntity> getLikeListByItemId(Long itemId){

   	   Item item = new Item();
   	   item.setItemId(itemId);
   	   
    	return likeRepository.findAllByItem(item);
    }
    
    public List<LikeEntity> getLikeListByItemIdAndUser(UserLogin user, Item item) {
    	List<LikeEntity> likeItem = likeRepository.findAllByUserAndItem(user, item);
    	return likeItem;
    }
    
    public List<LikeEntity> getLikeListByItemIdAndPlanner(PlannerLogin planner, Item item) {
    	List<LikeEntity> likeItem = likeRepository.findAllByPlannerAndItem(planner, item);
    	return likeItem;
    }
    
    public List<LikeEntity> getLikeListByLikeId(Long likeId){

    	   Optional<LikeEntity> item = likeRepository.findById(likeId);
    	   LikeEntity foundItem = item.get();
    	   Item searchedItem = foundItem.getItem();

     	return likeRepository.findAllByItem(searchedItem);
     }

		@Transactional
    public void increaseLikeNum(List<LikeEntity> list) {
    	int newCount = list.size() + 1;
    	for (LikeEntity like : list) {
        like.setLikeCount(newCount);
        likeRepository.save(like);
    	}
    }
    
    public void decreaseLikeNum(List<LikeEntity> list) {
  
    	Item targetItem = list.get(0).getItem();   
    	List<LikeEntity> targetList = likeRepository.findAllByItem(targetItem);
    	for(int i=0;i<targetList.size();i++) {
	    	LikeEntity likeentity = targetList.get(i);
	    	likeentity.setLikeCount(targetList.size()-1);
	    	likeRepository.save(likeentity);
	    }
    }
    
//    //정렬(가나다순, 인기순, 지역순)

	
}