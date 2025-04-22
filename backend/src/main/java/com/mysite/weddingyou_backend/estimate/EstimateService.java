package com.mysite.weddingyou_backend.estimate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
@Service
public class EstimateService {

	public final EstimateRepository estimateRepository;
	
	
	public void insert(Estimate data) {
		estimateRepository.save(data);	
	}
	
	
	//전체 견적 게시글 조회
	public List<Estimate> getlist(){			
		List<Estimate> list = estimateRepository.findAllByOrderByIdDesc();
		return list;  

	}
	
	//검색어 조회
	public List<Estimate> getsearchlist(String search) {
		List<Estimate> list = estimateRepository.getsearchlist(search);
		return list;
	}
	
	//전체 게시글 수 조회
	public int getcount() {
		int count = estimateRepository.getcount();
		return count;
	}
	
	//견적서 상세조회
	public Estimate getdetail(int id) {
		estimateRepository.increaseViewCount(id);
		Estimate data = estimateRepository.findById(id).orElse(null);
		return data;
	}
	
	//견적서 삭제
	public void delete(int id ) {
		estimateRepository.deleteById(id);
	}
	
	
			
}
