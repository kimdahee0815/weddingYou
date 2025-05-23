package com.mysite.weddingyou_backend.item;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mysite.weddingyou_backend.item.Item.Category1;
import com.mysite.weddingyou_backend.item.Item.Category2;
import com.mysite.weddingyou_backend.like.LikeEntity;
import com.mysite.weddingyou_backend.like.LikeRepository;

@Service
public class ItemService {
	
	@Autowired
	private final ItemRepository itemRepository;
	
	@Autowired
	private final LikeRepository likeRepository;

    public ItemService(ItemRepository itemRepository, LikeRepository likeRepository) {
        this.itemRepository = itemRepository;
        this.likeRepository=likeRepository;
    }


    public List<Item> getItemsSortedBy(Category1 category1, Category2 category2, String sort) {
        List<Item> itemList = itemRepository.findByCategory1AndCategory2FetchJoin(category1, category2);
    
        if (sort == null || sort.equals("latest")) {
            Collections.sort(itemList, (a, b) -> b.getItemWriteDate().compareTo(a.getItemWriteDate()));
        } else if (sort.equals("likeCount")) {
        	//likeid로 불러온 like 테이블 내의 likecount를 get하는 함수 쓰기
       //     Collections.sort(itemList, (a, b) -> b.getLikeCount() - a.getLikeCount());
        } else if (sort.equals("name")) {
            Collections.sort(itemList, (a, b) -> a.getItemName().compareTo(b.getItemName()));
        }

        return itemList;
    }
    
    public List<ItemDTO> getItemsByCategory1AndCategory2(Category1 category1, Category2 category2) {
        List<Item> items = itemRepository.findByCategory1AndCategory2FetchJoin(category1, category2);
        Collections.sort(items, (a, b) -> b.getItemWriteDate().compareTo(a.getItemWriteDate()));
        List<ItemDTO> itemDTOs = items.stream()
            .map(ItemDTO::fromEntity)
            .sorted((a, b) -> b.getItemWriteDate().compareTo(a.getItemWriteDate()))
            .collect(Collectors.toList());
        
        return itemDTOs;
    }
    
    public List<ItemDTO> getItemsByCategory1(Category1 category1) {
        List<Item> items = itemRepository.findByCategory1FetchJoin(category1); 
        Collections.sort(items, (a, b) -> b.getItemWriteDate().compareTo(a.getItemWriteDate()));
        List<ItemDTO> itemDTOs = items.stream()
            .map(ItemDTO::fromEntity)
            .sorted((a, b) -> b.getItemWriteDate().compareTo(a.getItemWriteDate()))
            .collect(Collectors.toList());
        
            return itemDTOs;
    }

    public Item getItemWithLikes(Long itemId) {
        return itemRepository.findItemWithLikes(itemId);
    }

    public Item getItemById(Long itemId) {
        Optional<Item> optionalItem = itemRepository.findById(itemId);
        if (optionalItem.isPresent()) {
            return optionalItem.get();
        } else {
            throw new RuntimeException("Item not found with id: " + itemId);
        }
    }
    
    public Item createItem(ItemDTO itemDTO) {
        Item item = new Item();
        item.setImgContent(itemDTO.getImgContent());
        item.setContent(itemDTO.getContent());
        item.setItemName(itemDTO.getItemName());
        item.setCategory1(itemDTO.getCategory1());
        item.setCategory2(itemDTO.getCategory2());
        item.setItemImg(itemDTO.getItemImg());
        item.setItemWriteDate(LocalDateTime.now());
        return itemRepository.save(item);
    }
    

	 

    public Item updateItem(Long itemId, ItemDTO itemDTO) {
        Item item = getItemById(itemId);
        item.setItemName(itemDTO.getItemName());
        item.setCategory1(itemDTO.getCategory1());
        item.setCategory2(itemDTO.getCategory2());
        item.setContent(itemDTO.getContent());
        item.setImgContent(itemDTO.getImgContent());
        if(itemDTO.getItemImg()!=null) {
            item.setItemImg(itemDTO.getItemImg());
        }
        item.setItemWriteDate(LocalDateTime.now());
        return itemRepository.save(item);
    }

    public void deleteItem(Long itemId) {
        Item item = getItemById(itemId);
        itemRepository.delete(item);
    }

    public int getLikeCount(Long itemId) {
        int like_count=0;
    	Item item = new Item();
		item.setItemId(itemId);
		LikeEntity like = new LikeEntity();
		like.setItem(item);
		List<LikeEntity> likeEntities = likeRepository.findAllByItem(item);
		like_count = likeEntities.size();
		return like_count;
	 }
    
  //검색
  	public List<ItemDTO> searchItems(String keyword) {
  		keyword = keyword.toLowerCase(); // 검색어를 소문자로 변환
        List<Item> items = itemRepository.findByItemNameWithLikesAndUserPlanner(keyword);
        List<ItemDTO> itemDTOs = items.stream()
            .map(ItemDTO::fromEntity)
            .collect(Collectors.toList());
        return itemDTOs;
    }

}

