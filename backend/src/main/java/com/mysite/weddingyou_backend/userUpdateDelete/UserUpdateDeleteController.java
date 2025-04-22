package com.mysite.weddingyou_backend.userUpdateDelete;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mysite.weddingyou_backend.like.LikeRepository;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLoginRepository;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDeleteService;
import com.mysite.weddingyou_backend.userLogin.UserLoginRepository;

@RestController //데이터를 반환
public class UserUpdateDeleteController {
	
	@Autowired
	UserUpdateDeleteService service;

	
	@Autowired
	PlannerLoginRepository plannerRepository;
	
	@Autowired
	UserLoginRepository userRepository;
	
	@Autowired
	LikeRepository likeRepository;
	

	 @PostMapping("/user/userSearch")
	 public UserUpdateDelete searchUser(@RequestBody UserUpdateDeleteDTO user) throws Exception {
		
		 
		 	UserUpdateDelete searchedUser = service.getUserByEmail(user.getEmail());
		 	if(searchedUser != null) {
	        	 return searchedUser;
	        }else {
	        	throw new Exception("이메일이 중복되지 않습니다!");
	        }
		   
	 }


	 @PostMapping("/user/userDelete")
	    public ResponseEntity<UserUpdateDelete> deleteUser(@RequestBody UserUpdateDeleteDTO user) {
		 UserUpdateDelete searchedUser = service.getUserByEmail(user.getEmail());
		service.delete(searchedUser);
		return ResponseEntity.status(HttpStatus.OK).build();
	    }
	 
	 @PostMapping("/user/userUpdate")
	    public UserUpdateDelete updateUser(@RequestBody UserUpdateDeleteDTO user) throws Exception {
		 UserUpdateDelete searchedUser = service.getUserByEmail(user.getPreemail());
		 UserUpdateDelete emailDuplicateUser = service.getUserByEmail(user.getEmail());
		 if(user.getPreemail().equals(user.getEmail()) || emailDuplicateUser==null) {
			 searchedUser.setEmail(user.getEmail());
			 searchedUser.setPassword(user.getPassword());
			 searchedUser.setPhoneNum(user.getPhoneNum());
			 searchedUser.setGender(user.getGender());
			service.save(searchedUser);
		 }else {
			 throw new Exception("이메일이 중복됩니다!");
		 }
		
		 return searchedUser;
		
	    }
	 
	 @PostMapping("/user/updateprofileImg")
	 public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("useremail") String email) {
		    try {	
		    	UserUpdateDelete searchedUser = service.getUserByEmail(email);
		    	String path1 = "C:\\Project";
		    	String path2 = "C:\\Project\\profileImg";
		    	String path3 = "C:\\Project\\profileImg\\user";
		    	File folder1 = new File(path1);
		    	File folder2 = new File(path2);
		    	File folder3 = new File(path3);
		    	if(!folder1.exists() || !folder2.exists() || !folder3.exists()) {
		    		try {
		    			folder1.mkdir();
		    			folder2.mkdir();
		    			folder3.mkdir();
		    		}catch(Exception e) {
		    			e.getStackTrace();
		    		}
		    	}
		    	
		    	
		    	if(searchedUser.getUserImg() != null) {
		    		Path deleteFilePath = Paths.get(path3, searchedUser.getUserImg());
		    		Files.delete(deleteFilePath);
		    	}
		    	
		        Files.copy(file.getInputStream(), Paths.get("C:/Project/profileImg/user", file.getOriginalFilename()),StandardCopyOption.REPLACE_EXISTING); //request에서 들어온 파일을 uploads 라는 경로에 originalfilename을 String 으로 올림
		        System.out.println(file.getInputStream());
		        searchedUser.setUserImg(file.getOriginalFilename()); //searchedUser에다가 이미지 파일 이름 저장
		        //searchedUser.setUserImgUrl((Blob) file);
		        service.save(searchedUser); // 이미지파일이름 데이터베이스에 업데이트함
		        System.out.println(searchedUser.getUserImg());
		        return ResponseEntity.ok().build();
		    } catch (IOException e) {
		        e.printStackTrace();
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		    }
		}
	
	 
	 @RequestMapping(value="/user/getprofileImg",  produces = MediaType.IMAGE_JPEG_VALUE)
	 public ResponseEntity<byte[]> getImage(@RequestBody UserUpdateDeleteDTO user) {
		// System.out.println("유저이메일: " + user.getEmail());
		 UserUpdateDelete searchedUser = service.getUserByEmail(user.getEmail());
	     if (searchedUser != null) {
	         Path imagePath = Paths.get("C:/Project/profileImg/user",searchedUser.getUserImg());

	         try {
	             byte[] imageBytes = Files.readAllBytes(imagePath);
	             byte[] base64encodedData = Base64.getEncoder().encode(imageBytes);
	              return ResponseEntity.ok()
	                      .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + 
	                    		  searchedUser.getUserImg() + "\"")
	                      .body(base64encodedData);
	         } catch (IOException e) {
	             e.printStackTrace();
	             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	         }
	 
	     } else {
	         return ResponseEntity.notFound().build();
	     }
	 }
	 
	 	

}