package com.mysite.weddingyou_backend.userUpdateDelete;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

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

import com.mysite.weddingyou_backend.S3Service;
import com.mysite.weddingyou_backend.like.LikeRepository;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLoginRepository;
import com.mysite.weddingyou_backend.userLogin.UserLoginRepository;

@RestController //데이터를 반환
public class UserUpdateDeleteController {
	
	@Autowired
	UserUpdateDeleteService service;

	@Autowired
	private final S3Service s3Service;

	public UserUpdateDeleteController(S3Service s3Service) {
	  this.s3Service = s3Service;
	}

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
	  }
		return null; 
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
				searchedUser.setName(user.getName());
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
		UserUpdateDelete searchedUser = service.getUserByEmail(email);
		String imageUrl = s3Service.uploadFile(file, "users");
					
		searchedUser.setUserImg(imageUrl); 
		service.save(searchedUser); 
		return ResponseEntity.ok().build();
	}
	
	@RequestMapping(value="/user/getprofileImg",  produces = MediaType.IMAGE_JPEG_VALUE)
	public ResponseEntity<byte[]> getImage(@RequestBody UserUpdateDeleteDTO user) {
		UserUpdateDelete searchedUser = service.getUserByEmail(user.getEmail());
		if (searchedUser != null) {
			String fullPath = searchedUser.getUserImg();
    
			if(fullPath != null){
				String key = fullPath.substring(fullPath.indexOf(".com/") + 5);
				key = URLDecoder.decode(key, StandardCharsets.UTF_8);
				byte[] imageBytes = s3Service.downloadFile(key);
	
				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(MediaType.IMAGE_JPEG);
	
				return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK); 
			}
		}
		return ResponseEntity.notFound().build();
	}

}