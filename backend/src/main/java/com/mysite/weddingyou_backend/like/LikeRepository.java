package com.mysite.weddingyou_backend.like;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mysite.weddingyou_backend.item.Item;
import com.mysite.weddingyou_backend.item.Item.Category1;
import com.mysite.weddingyou_backend.item.Item.Category2;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLogin;
import com.mysite.weddingyou_backend.userLogin.UserLogin;

@Repository
public interface LikeRepository extends JpaRepository<LikeEntity, Long> {	

	List<LikeEntity> findByUser(UserLogin user);
	
	List<LikeEntity> findByPlanner(PlannerLogin planner);
	
	List<LikeEntity> findByUserAndItem_Category1AndItem_Category2(UserLogin user, Category1 category1, Category2 category2);
	
	List<LikeEntity> findByUserAndItem_Category1(UserLogin user, Category1 category1);
	
	List<LikeEntity> findByPlannerAndItem_Category1(PlannerLogin planner, Category1 category1);
	
	List<LikeEntity> findAllByItem(Item item);
	
	List<LikeEntity> findAllByUserAndItem(UserLogin user, Item item);
	
	List<LikeEntity> findAllByPlannerAndItem(PlannerLogin planner, Item item);
	
	boolean existsByUserAndItem(UserLogin user, Item item);
	
	boolean existsByPlannerAndItem(PlannerLogin planner, Item item);

	int countByItemId(Long itemId);
}
