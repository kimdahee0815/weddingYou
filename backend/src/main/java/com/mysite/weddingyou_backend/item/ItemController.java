package com.mysite.weddingyou_backend.item;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mysite.weddingyou_backend.S3Service;
import com.mysite.weddingyou_backend.item.Item.Category1;
import com.mysite.weddingyou_backend.item.Item.Category2;
import com.mysite.weddingyou_backend.like.LikeService;
import com.mysite.weddingyou_backend.like.likeDTO;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLoginRepository;
import com.mysite.weddingyou_backend.userLogin.UserLoginRepository;

@RestController
@RequestMapping("/item")
public class ItemController {
	
	private final ItemService itemService;
	private final S3Service s3Service;
	
	public ItemController(ItemService itemService, S3Service s3Service) {
	    this.itemService = itemService;
	    this.s3Service = s3Service;
	}
	
	// 이미지 목록 페이지
	@GetMapping("/itemList")
	public ResponseEntity<List<ItemDTO>> getItemsSortedBy(
	  @RequestParam(name = "category1")Category1 category1, @RequestParam(name = "category2")Category2 category2
	) {
	  List<ItemDTO> items =null;
	  items = itemService.getItemsByCategory1AndCategory2(category1, category2);
	         
	  return ResponseEntity.ok().body(items);
	}

	// 이미지 목록 페이지
	@RequestMapping("/getItemList/{itemId}")
	public ResponseEntity<Item> getItemByItemId(
		@PathVariable(name = "itemId")String itemId) {
		Item item =null;
		item = itemService.getItemById(Long.parseLong(itemId));
		         
		return ResponseEntity.ok().body(item);
	}
	
	@RequestMapping(value="/itemList/{category1}")
	public List<ItemDTO> getItemsByCategory1(@PathVariable Category1 category1) {
		List<ItemDTO> items =null;
		items = itemService.getItemsByCategory1(category1);

	  return items;
	}
	
	@RequestMapping(value="/itemList/{category1}/{category2}")
	public List<ItemDTO> getImagesByCategory1AndCategory2(@PathVariable Category1 category1, @PathVariable Category2 category2) {
		List<ItemDTO> items =null;
	  items = itemService.getItemsByCategory1AndCategory2(category1, category2);

		return items;
	}

	//검색
	@RequestMapping("/search/{keyword}")
	public HashMap<String, List<Item>> searchItems(@PathVariable ("keyword") String keyword, @RequestBody likeDTO like) {
			String email = like.getEmail();
			List<Item> items =new ArrayList<>();
	    items = itemService.searchItems(keyword);
	    HashMap<String, List<Item>> sortedItemsMap = new HashMap<String, List<Item>>();
	        
	    List<Item> weddingHallItems = new ArrayList<>();
	    List<Item> studioItems = new ArrayList<>();
	    List<Item> dressItems = new ArrayList<>();
	    List<Item> makeupItems = new ArrayList<>();
	    List<Item> honeymoonItems = new ArrayList<>();
	    List<Item> bouquetItems = new ArrayList<>();
	        
	    if(items.size()!=0) {
	        for(int i =0;i<items.size();i++) {
	 	      Category1 category1 = items.get(i).getCategory1();
	 	      if(category1.toString().equals("웨딩홀")) {
	 	        weddingHallItems.add(items.get(i));
	 	      }else if(category1.toString().equals("스튜디오")) {
	 	        studioItems.add(items.get(i));
	 	      }else if(category1.toString().equals("의상")) {
	 	        dressItems.add(items.get(i));
	 	      }else if(category1.toString().equals("메이크업")) {
	 	        makeupItems.add(items.get(i));
	 	      }else if(category1.toString().equals("신혼여행")) {
	 	        honeymoonItems.add(items.get(i));
	 	      }else if(category1.toString().equals("부케")) {
	 	        bouquetItems.add(items.get(i));
	 	      }
	 	        	
	 	    }
	      Collections.sort(weddingHallItems, (a, b) -> b.getItemWriteDate().compareTo(a.getItemWriteDate()));
	 	    Collections.sort(studioItems, (a, b) -> b.getItemWriteDate().compareTo(a.getItemWriteDate()));
	 	    Collections.sort(dressItems, (a, b) -> b.getItemWriteDate().compareTo(a.getItemWriteDate()));
	 	    Collections.sort(makeupItems, (a, b) -> b.getItemWriteDate().compareTo(a.getItemWriteDate()));
	 	    Collections.sort(honeymoonItems, (a, b) -> b.getItemWriteDate().compareTo(a.getItemWriteDate()));
	 	    Collections.sort(bouquetItems, (a, b) -> b.getItemWriteDate().compareTo(a.getItemWriteDate()));

				sortedItemsMap.put("weddinghall", weddingHallItems);
				sortedItemsMap.put("studio", studioItems);
				sortedItemsMap.put("dress", dressItems);
				sortedItemsMap.put("makeup", makeupItems);
				sortedItemsMap.put("honeymoon", honeymoonItems);
				sortedItemsMap.put("bouquet", bouquetItems);	        
	    }

	    //     List<String> encodingDatas = new ArrayList<>();

	    // if(items.size()!=0) {
	    // 	for(int i =0;i<items.size()+6;i++) {

	    // 		Item targetItem = sortedItems.get(i);
	    // 		System.out.println(targetItem.getItemId());
	    // 		if(targetItem.getItemId()!=null) {
	    // 			Category2 category2 = targetItem.getCategory2();
	    // 			Long itemId = targetItem.getItemId();

			//     	 String path = "C:/Project/itemImg/"+targetItem.getCategory1()+"/"+category2;
			//     	 Path imagePath = Paths.get(path,targetItem.getItemImg());
			//     	 System.out.println(imagePath);

			//          try {
			//              byte[] imageBytes = Files.readAllBytes(imagePath);
			//              byte[] base64encodedData = Base64.getEncoder().encode(imageBytes);

			//              encodingDatas.add(new String(base64encodedData));

			//          } catch (IOException e) {
			//              e.printStackTrace();

			//          }

			//          encodingDatas.add(String.valueOf(targetItem.getItemId()));
			//          encodingDatas.add(String.valueOf(targetItem.getItemName()));
			//          encodingDatas.add(String.valueOf(targetItem.getImgContent()));
			//          encodingDatas.add(String.valueOf(targetItem.getLike().size()));
			// int res = 0;
			// if(email==null) { //로그인하지 않았을 경우
			//   res = -1;
			// }else { //로그인했을 경우
			// 	List<LikeEntity> likeItem = new ArrayList<>();
			// 	if(userRepository.findByEmail(email)!=null) {
			// 		UserLogin user = userRepository.findByEmail(email);
			// 		likeItem = likeService.getLikeListByItemIdAndUser(user, targetItem);
					
			// 		if(likeItem.size()!=0) { //찾은 결과가 있을 때
			// 		 	res = 1;
			// 		}else {
			// 		 	res = 0;
			// 		}
			// 	}else if(plannerRepository.findByEmail(email)!=null) {
			// 		PlannerLogin planner = plannerRepository.findByEmail(email);
			// 		likeItem = likeService.getLikeListByItemIdAndPlanner(planner, targetItem);

			// 		if(likeItem.size()!=0) {
			// 		 	res = 1;
			// 		}else  {
			// 		 	res = 0;
			// 		}
			// 	}
			// }     
	    return sortedItemsMap;
		     
	}
	        
	 
	 
	 // 이미지 목록 정렬
	 @GetMapping("/sortItems")
	 public ResponseEntity<List<Item>> getItemsByCategorySorted(@RequestParam("category1") Category1 category1, 
			 @RequestParam("category2") Category2 category2, @RequestParam(value = "sort", required = false) String sort) {
	     List<Item> items = itemService.getItemsSortedBy(category1,category2, sort);

	     return ResponseEntity.ok().body(items);
	 }

	@PostMapping("/insertItem")
	public ResponseEntity<Item> createItem(@RequestParam("file") MultipartFile file,
	    @RequestParam("category1") Category1 category1,
	    @RequestParam("category2") Category2 category2,
	    @RequestParam("itemName") String itemName,
	    @RequestParam("content") String content,
			@RequestParam("imgContent") String imgContent) {
	        
	  String imageUrl = s3Service.uploadFile(file, "items/" + category1 + "/" + category2);
	        
	  ItemDTO itemDTO = new ItemDTO();
	  itemDTO.setItemName(itemName);
	  itemDTO.setCategory1(category1);
	  itemDTO.setCategory2(category2);
	  itemDTO.setContent(content);
	  itemDTO.setItemImg(imageUrl);
		itemDTO.setImgContent(imgContent);

	  Item createdItem = itemService.createItem(itemDTO);
	  return ResponseEntity.ok(createdItem);
	}
	
	@PostMapping("/updateItem/{itemId}")
	public ResponseEntity<Item> updateItem(@RequestParam(value="file", required=false) MultipartFile file,@PathVariable Long itemId,  @RequestParam("itemName") String itemName, 
		@RequestParam("content") String content, @RequestParam("imgContent") String imgContent) {

		ItemDTO itemDTO = new ItemDTO();
		Item searchedItem = itemService.getItemById(itemId);

		if(file!=null) {
		  String imageUrl = s3Service.uploadFile(file, "items/" + searchedItem.getCategory1() + "/" + searchedItem.getCategory2());
			itemDTO.setItemImg(imageUrl);
		}

		itemDTO.setCategory1(searchedItem.getCategory1());
		itemDTO.setCategory2(searchedItem.getCategory2());
		itemDTO.setContent(content);
		itemDTO.setImgContent(imgContent);
		itemDTO.setItemName(itemName);
		Item updatedItemDTO = itemService.updateItem(itemId,itemDTO); 
		return ResponseEntity.ok().body(updatedItemDTO);
	
	}
  
	@PostMapping("/deleteItem/{itemId}")
	public ResponseEntity<String> deleteItem(@PathVariable Long itemId) {
		itemService.deleteItem(itemId); 
		return ResponseEntity.ok().body("Item with id " + itemId + " has been deleted.");
	}

	@RequestMapping("/getLikeCount")
	public int getLikeCount(@RequestParam(value = "itemId") Long itemId) {
		
		int likeCount =  itemService.getLikeCount(itemId);
		return likeCount;
	}


	@GetMapping("/getitemImg/{itemId}")
	public ResponseEntity<byte[]> getImage(@PathVariable Long itemId) {
	  Item item = itemService.getItemById(itemId);
		String fullPath = item.getItemImg();
    
    String key = fullPath.substring(fullPath.indexOf(".com/") + 5);
	  key = URLDecoder.decode(key, StandardCharsets.UTF_8);
		byte[] imageBytes = s3Service.downloadFile(key);

		HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.IMAGE_JPEG);

	  return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
	}	
}

