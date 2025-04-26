package com.mysite.weddingyou_backend.plannerUpdateDelete;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

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
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDeleteDTO;

@RestController //데이터를 반환
public class PlannerUpdateDeleteController {
	
	@Autowired
	PlannerUpdateDeleteService service;

	@Autowired
	private final S3Service s3Service;

	public PlannerUpdateDeleteController(S3Service s3Service) {
		this.s3Service = s3Service;
	}
	
	@Autowired
	PlannerLoginRepository plannerRepository;
	
	@Autowired
	UserLoginRepository userRepository;
	
	@Autowired
	LikeRepository likeRepository;

	@PostMapping("/planner/plannerSearch")
  public PlannerUpdateDelete searchUser(@RequestBody PlannerUpdateDeleteDTO planner) throws Exception {
    PlannerUpdateDelete searchedPlanner = service.getPlannerByEmail(planner.getEmail());
    if(searchedPlanner != null) {
      return searchedPlanner;
    }
		return null;
  }

	@PostMapping("/planner/plannerDelete")
	public ResponseEntity<PlannerUpdateDelete> deleteUser(@RequestBody PlannerUpdateDeleteDTO planner) {
		PlannerUpdateDelete searchedPlanner = service.getPlannerByEmail(planner.getEmail());
		
		service.delete(searchedPlanner);
		return ResponseEntity.status(HttpStatus.OK).build();
	}

	@PostMapping("/planner/userUpdate")
	public PlannerUpdateDelete updateUser(@RequestBody PlannerUpdateDeleteDTO planner) throws Exception {
		PlannerUpdateDelete searchedPlanner = service.getPlannerByEmail(planner.getPreemail());
		PlannerUpdateDelete emailDuplicatePlanner = service.getPlannerByEmail(planner.getEmail());
		System.out.println("planner email : "+ planner.getEmail());
		System.out.println("planner pre email : "+ planner.getPreemail());
		System.out.println("planner : "+ planner);
		if(planner.getPreemail().equals(planner.getEmail())||emailDuplicatePlanner==null) {
			searchedPlanner.setEmail(planner.getEmail());
			searchedPlanner.setPassword(planner.getPassword());
			searchedPlanner.setPhoneNum(planner.getPhoneNum());
			searchedPlanner.setGender(planner.getGender());
			searchedPlanner.setPlannerCareerYears(planner.getCareer());
			searchedPlanner.setIntroduction(planner.getIntroduction());
			service.save(searchedPlanner);
		}else {
			throw new Exception("이메일이 중복됩니다!");
		}
		
		return searchedPlanner;
	}

	@PostMapping("/planner/updateprofileImg")
	public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("useremail") String email) {
		PlannerUpdateDelete searchedPlanner = service.getPlannerByEmail(email);
		String imageUrl = s3Service.uploadFile(file, "users/");
								
		// if(searchedUser.getUserImg() != null) {
		// 	Path deleteFilePath = Paths.get(path3, searchedUser.getUserImg());
		// 	Files.delete(deleteFilePath);
		// }
		searchedPlanner.setPlannerImg(imageUrl); 
		service.save(searchedPlanner); 
		return ResponseEntity.ok().build();
	}
	
	@RequestMapping(value="/planner/getprofileImg",  produces = MediaType.IMAGE_JPEG_VALUE)
	public ResponseEntity<byte[]> getImage(@RequestBody UserUpdateDeleteDTO user) {
		PlannerUpdateDelete searchedPlanner = service.getPlannerByEmail(user.getEmail());
		if (searchedPlanner != null) {
			String fullPath = searchedPlanner.getPlannerImg();
    
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