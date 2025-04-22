package com.mysite.weddingyou_backend.item;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mysite.weddingyou_backend.item.Item.Category1;
import com.mysite.weddingyou_backend.item.Item.Category2;


public interface ItemRepository extends JpaRepository<Item, Long> {

	List<Item> findByCategory1AndCategory2(Category1 category1, Category2 category2);
	
	List<Item> findByCategory1(Category1 category1);
	
	List<Item> findByItemNameContaining(String keyword); //검색 메소드
}