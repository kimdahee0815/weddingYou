package com.mysite.weddingyou_backend.item;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mysite.weddingyou_backend.item.Item.Category1;
import com.mysite.weddingyou_backend.item.Item.Category2;


public interface ItemRepository extends JpaRepository<Item, Long> {

	@Query("SELECT DISTINCT i FROM Item i " +
       "LEFT JOIN FETCH i.like l " +
       "LEFT JOIN FETCH l.user " +
       "LEFT JOIN FETCH l.planner " +
       "WHERE i.category1 = :category1 AND i.category2 = :category2")
	List<Item> findByCategory1AndCategory2FetchJoin(@Param("category1") Category1 category1,
                                                @Param("category2") Category2 category2);
	
	List<Item> findByCategory1(Category1 category1);
	
	@Query("SELECT DISTINCT i FROM Item i " +
       "LEFT JOIN FETCH i.like l " +
       "LEFT JOIN FETCH l.user " +
       "LEFT JOIN FETCH l.planner " +
       "WHERE i.itemName LIKE %:keyword%")
       List<Item> findByItemNameWithLikesAndUserPlanner(@Param("keyword") String keyword);

	@Query("SELECT i FROM Item i LEFT JOIN FETCH i.like l LEFT JOIN FETCH l.user LEFT JOIN FETCH l.planner WHERE i.itemId = :itemId")
	Item findItemWithLikes(@Param("itemId") Long itemId);

	@Query("SELECT DISTINCT i FROM Item i " +
       "LEFT JOIN FETCH i.like l " +
       "LEFT JOIN FETCH l.user " +
       "LEFT JOIN FETCH l.planner " +
       "WHERE i.category1 = :category1")
	List<Item> findByCategory1FetchJoin(@Param("category1") Category1 category1);
}