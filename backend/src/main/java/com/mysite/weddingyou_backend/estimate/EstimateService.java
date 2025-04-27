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
	
	//견적서 상세조회
		public Estimate getEstimateDetail(Long id) {
			Estimate data = estimateRepository.findById(id);
			return data;
		}
		
		//견적서 상세조회
				public List<Estimate> getEstimateDetailByEmail(String userEmail) {
					List<Estimate> data = estimateRepository.findAllByWriter(userEmail);
					return data;
				}
		
		//견적서 매칭 플래너 업데이트
	public Estimate save(Estimate data) {
			System.out.println("service:"+data.getPlannermatching());
			estimateRepository.save(data);
			return data;
	}
	
	//견적서 삭제
	public void delete(Long id ) {
		estimateRepository.deleteById(id);
	}

	
	public List<Estimate> pageinglist(int page_num, int limit) {
		int start = (page_num - 1) * limit;
		return estimateRepository.pageinglist(start, limit);
	}
	
	//검색데이터 갯수 
	public int getsearchlistcount(String search) {
			return estimateRepository.getsearchlistcount(search);
	}
	
	//검색데이터 조회
	public List<Estimate> getsearchlistpageing(int page_num, int limit, String search) {
		int start = (page_num - 1)*limit; 
		return estimateRepository.getsearchlistpageing(start,limit,search);
	}


	public List<Estimate> getUnmatchedEstimates(String userEmail) {
		return estimateRepository.findAllByWriter(userEmail);
	}

	
			
}
