package com.mysite.weddingyou_backend.like;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mysite.weddingyou_backend.item.Item;
import com.mysite.weddingyou_backend.item.Item.Category1;
import com.mysite.weddingyou_backend.item.Item.Category2;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLogin;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDelete;
import com.mysite.weddingyou_backend.userLogin.UserLogin;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDelete;

@Repository
public interface LikeRepository extends JpaRepository<LikeEntity, Long> {	
	@Query("SELECT l FROM LikeEntity l JOIN FETCH l.item WHERE l.user = :user")
	List<LikeEntity> findByUserWithItem(@Param("user") UserLogin user);

	@Query("SELECT l FROM LikeEntity l JOIN FETCH l.item WHERE l.planner = :planner")
	List<LikeEntity> findByPlannerWithItem(@Param("planner") PlannerLogin planner);

	@EntityGraph(attributePaths = {"item"})
	List<LikeEntity> findByUserEmail(String email);

	@EntityGraph(attributePaths = {"item"})
	List<LikeEntity> findByPlannerEmail(String email);
	
	@Query("SELECT l FROM LikeEntity l JOIN FETCH l.item WHERE l.user = :user AND l.item.category1 = :category1 AND l.item.category2 = :category2")
	List<LikeEntity> findByUserAndItem_Category1AndItem_Category2(UserLogin user, Category1 category1, Category2 category2);
	
	@Query("SELECT l FROM LikeEntity l JOIN FETCH l.item WHERE l.user = :user AND l.item.category1 = :category1")
	List<LikeEntity> findByUserAndItem_Category1(UserLogin user, Category1 category1);
	
	@Query("SELECT l FROM LikeEntity l JOIN FETCH l.item WHERE l.planner = :planner AND l.item.category1 = :category1")
	List<LikeEntity> findByPlannerAndItem_Category1(PlannerLogin planner, Category1 category1);
	
	List<LikeEntity> findAllByItem(Item item);
	
	List<LikeEntity> findAllByUserAndItem(UserLogin user, Item item);
	
	List<LikeEntity> findAllByPlannerAndItem(PlannerLogin planner, Item item);
	
	boolean existsByUserAndItem(UserLogin user, Item item);
	
	boolean existsByPlannerAndItem(PlannerLogin planner, Item item);

	@Query("SELECT COUNT(l) FROM LikeEntity l WHERE l.item.id = :itemId")
	int countByItemId(@Param("itemId") Long itemId);
}
