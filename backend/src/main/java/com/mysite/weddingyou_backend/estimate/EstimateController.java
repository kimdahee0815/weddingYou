package com.mysite.weddingyou_backend.estimate;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/estimate")
public class EstimateController {

	public final EstimateService estimateService;
	
	@Value("${spring.servlet.multipart.location}")
    String uploadDir;

	@PostMapping(value = "/write", produces = "multipart/form-data")
	public void insertData(@RequestParam(value = "uploadfiles", required = false) MultipartFile[] uploadfiles,
	                       @RequestParam("weddingdate") String weddingdate,
	                       @RequestParam("budget") int budget,
	                       @RequestParam("region") String region,
	                       @RequestParam("honeymoon") String honeymoon,
	                       @RequestParam("makeup") String makeup,
	                       @RequestParam("dress") String dress,
	                       @RequestParam("requirement") String requirement,
	                       @RequestParam("studio") String studio,
	                       @RequestParam("writer") String writer)  throws IOException {
	    // 이미지 데이터 처리 로직
		List<String> list = new ArrayList<>();
		if(!(uploadfiles == null)) {
        for (MultipartFile file : uploadfiles) {
            if (!file.isEmpty()) {
                File storedFilename = new File(UUID.randomUUID().toString() + "_" + file.getOriginalFilename());
                list.add("\"" + storedFilename.toString() + "\"");
                file.transferTo(storedFilename); //업로드
            }
        }
		}
		Estimate data = new Estimate();
		data.setWeddingdate(weddingdate);
		data.setBudget(budget);
		data.setRegion(region);
		data.setHoneymoon(honeymoon);
		data.setMakeup(makeup);
		data.setDress(dress);
		data.setRequirement(requirement);
		data.setStudio(studio);
		data.setWriter(writer);
		data.setImg(list.toString());
		data.setMatchstatus(false);
		data.setTitle(writer + "님의 견적서");
		data.setDate(LocalDate.now());
		data.setViewcount(0);		
		estimateService.insert(data);
	}
	
	//전체 데이터 조회
	@ResponseBody
	@GetMapping("/getlist")
	public ResponseEntity<List<Estimate>> getList() {
	    List<Estimate> list = estimateService.getlist();
	    return ResponseEntity.ok().body(list);
	}


	//전체 데이터 개수 조회
	@ResponseBody
	@GetMapping("/getcount")
	public ResponseEntity<Integer> getCount() {
		int count = estimateService.getcount();
		return ResponseEntity.ok().body(count);
	}
	
	//검색 데이터 조회	
	@GetMapping("/getsearchlist")
	public ResponseEntity<List<Estimate>> getsearchlist(@RequestParam String search){
		List<Estimate> list = estimateService.getsearchlist(search);
		return ResponseEntity.ok().body(list);
	}
	
	
	//이미지 출력 부분입니다.
	@RequestMapping("/imageview")
    public ResponseEntity<UrlResource> download(@RequestParam("image") String stored) throws MalformedURLException {
        UrlResource resource = new UrlResource("file:" + uploadDir + "/" + stored);
        return ResponseEntity.ok().body(resource);
    }

	
	//견적서 상세정보 조회 + 조회수 증가
	@RequestMapping("/getdetail/{id}")
	public Estimate getdetail(@PathVariable ("id") int id) {
	return estimateService.getdetail(id);
		} 
		
	
	//견적서 삭제
	@RequestMapping("/delete")
	public void delete(@RequestParam int id) {
		estimateService.delete(id);
	}
	
	
	//견적서 수정
	@PostMapping(value = "/modify", produces = "multipart/form-data")
	public void modifyData(@RequestParam(value = "uploadfiles", required = false) MultipartFile[] uploadfiles,
	                       @RequestParam("weddingdate") String weddingdate,
	                       @RequestParam("budget") int budget,
	                       @RequestParam("region") String region,
	                       @RequestParam("honeymoon") String honeymoon,
	                       @RequestParam("makeup") String makeup,
	                       @RequestParam("dress") String dress,
	                       @RequestParam("requirement") String requirement,
	                       @RequestParam("studio") String studio,
	                       @RequestParam("writer") String writer,  
	                       @RequestParam("previmage") String[] previmage,
	                       @RequestParam("id") long id)
	                    		   throws IOException {
	    // 이미지 데이터 처리 로직
		List<String> list = new ArrayList<>();
		for(int i = 0; i < previmage.length; i++) {
			list.add("\"" + previmage[i] + "\"");
		}
		if(!(uploadfiles == null)) {
        for (MultipartFile file : uploadfiles) {
            if (!file.isEmpty()) {
                File storedFilename = new File(UUID.randomUUID().toString() + "_" + file.getOriginalFilename());
                list.add("\"" + storedFilename.toString() + "\"");
                file.transferTo(storedFilename); //업로드
            }
        }
		}
		Estimate data = new Estimate();
		data.setWeddingdate(weddingdate);
		data.setBudget(budget);
		data.setRegion(region);
		data.setHoneymoon(honeymoon);
		data.setMakeup(makeup);
		data.setDress(dress);
		data.setRequirement(requirement);
		data.setStudio(studio);
		data.setWriter(writer);
		data.setImg(list.toString());
		data.setMatchstatus(false);
		data.setTitle(writer + "님의 견적서");
		data.setDate(LocalDate.now());
		data.setViewcount(0);		
		data.setId(id);
		estimateService.insert(data);
	}
	
	
	
	
	
	
	
}


