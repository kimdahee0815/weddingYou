package com.mysite.weddingyou_backend.plannerUpdateDelete;

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
import com.mysite.weddingyou_backend.userLogin.UserLoginRepository;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDeleteDTO;

@RestController //데이터를 반환
public class PlannerUpdateDeleteController {
	
	@Autowired
	PlannerUpdateDeleteService service;
	
	@Autowired
	PlannerLoginRepository plannerRepository;
	
	@Autowired
	UserLoginRepository userRepository;
	
	@Autowired
	LikeRepository likeRepository;
	
	//회원 조회
	@PostMapping("/planner/plannerSearch")
    public PlannerUpdateDelete searchUser(@RequestBody PlannerUpdateDeleteDTO planner) throws Exception {
        PlannerUpdateDelete searchedPlanner = service.getPlannerByEmail(planner.getEmail());
        if(searchedPlanner != null) {
        	 return searchedPlanner;
        }
				return null;
       
    }
	 
	 //회원 탈퇴
	 @PostMapping("/planner/plannerDelete")
	    public ResponseEntity<PlannerUpdateDelete> deleteUser(@RequestBody PlannerUpdateDeleteDTO planner) {
		 PlannerUpdateDelete searchedPlanner = service.getPlannerByEmail(planner.getEmail());
		service.delete(searchedPlanner);
		return ResponseEntity.status(HttpStatus.OK).build();
	    }
	 
	 //회원 업데이트
	 @PostMapping("/planner/userUpdate")
	    public PlannerUpdateDelete updateUser(@RequestBody PlannerUpdateDeleteDTO planner) throws Exception {
		 System.out.println(planner.getPreemail());
		 System.out.println(planner.getEmail());
		 PlannerUpdateDelete searchedPlanner = service.getPlannerByEmail(planner.getPreemail());
		 PlannerUpdateDelete emailDuplicatePlanner = service.getPlannerByEmail(planner.getEmail());
		 if(planner.getPreemail().equals(planner.getEmail())||emailDuplicatePlanner==null) {
			 searchedPlanner.setEmail(planner.getEmail());
			 searchedPlanner.setPassword(planner.getPassword());
			 searchedPlanner.setPhoneNum(planner.getPhoneNum());
			 searchedPlanner.setGender(planner.getGender());
			 searchedPlanner.setPlannerCareerYears(planner.getCareer());
			 service.save(searchedPlanner);
		 }else {
			 throw new Exception("이메일이 중복됩니다!");
		 }
		
		return searchedPlanner;
	   }
	 @PostMapping("/planner/updateprofileImg")
	 public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("useremail") String email) {
		    try {	
		    	PlannerUpdateDelete searchedPlanner = service.getPlannerByEmail(email);
		    	String path1 = "C:\\Project";
		    	String path2 = "C:\\Project\\profileImg";
		    	String path3 = "C:\\Project\\profileImg\\planner";
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
		    	if(searchedPlanner.getPlannerImg() != null) {
		    		Path deleteFilePath = Paths.get(path3, searchedPlanner.getPlannerImg());
		    		Files.delete(deleteFilePath);
		    	}
		        Files.copy(file.getInputStream(), Paths.get("C:/Project/profileImg/planner", file.getOriginalFilename()),StandardCopyOption.REPLACE_EXISTING); //request에서 들어온 파일을 uploads 라는 경로에 originalfilename을 String 으로 올림
		        System.out.println(file.getInputStream());
		        searchedPlanner.setPlannerImg(file.getOriginalFilename()); //searchedPlanner에다가 이미지 파일 이름 저장
		        service.save(searchedPlanner); // 이미지파일이름 데이터베이스에 업데이트함
		        System.out.println(searchedPlanner.getPlannerImg());
		        return ResponseEntity.ok().build();
		    } catch (IOException e) {
		        e.printStackTrace();
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		    }
		}
	
	 
	 @RequestMapping(value="/planner/getprofileImg",  produces = MediaType.IMAGE_JPEG_VALUE)
	 public ResponseEntity<byte[]> getImage(@RequestBody UserUpdateDeleteDTO user) {
		 System.out.println("유저이메일: " + user.getEmail());
		 PlannerUpdateDelete searchedPlanner = service.getPlannerByEmail(user.getEmail());
	     if (searchedPlanner != null) {
	         Path imagePath = Paths.get("C:/Project/profileImg/planner",searchedPlanner.getPlannerImg());
	         
	         try {
	             byte[] imageBytes = Files.readAllBytes(imagePath);
	             byte[] base64encodedData = Base64.getEncoder().encode(imageBytes);
	              return ResponseEntity.ok()
	                      .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + 
	                    		  searchedPlanner.getPlannerImg() + "\"")
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