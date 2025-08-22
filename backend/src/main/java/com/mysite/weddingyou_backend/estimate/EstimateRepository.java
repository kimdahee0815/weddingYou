package com.mysite.weddingyou_backend.estimate;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import jakarta.transaction.Transactional;

public interface EstimateRepository extends JpaRepository<Estimate, Integer> {

	//전체 게시글 개수 조회
	@Query(value = "SELECT count(*) FROM estimate",nativeQuery=true)
	int getcount();
	

	//검색어를 통한 조회
	@Query(value = "SELECT * FROM estimate WHERE (e_region LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_dress LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_makeup LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_honeymoon LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_studio LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_weddingdate LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_date LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_requirement LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR TO_CHAR(e_date, 'YYYY-MM') = :search \r\n"
			+ "OR TO_CHAR(e_date, 'MM-DD') = :search \r\n"
			+ "OR TO_CHAR(e_date, 'YYYY') = :search \r\n"
			+ "OR TO_CHAR(e_date, 'MM') = :search \r\n"
			+ "OR TO_CHAR(e_date, 'DD') = :search \r\n"
			+ "OR e_title LIKE CONCAT ('%', :search, '%'))"
			+ "Order By e_id desc\r\n"
			,nativeQuery=true)
	List<Estimate> getsearchlist(String search);
	
	
	//페이징을 위한 검색어 갯수 조회
	@Query(value = "SELECT count(*) FROM estimate WHERE (e_region LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_dress LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_makeup LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_honeymoon LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_writer LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_studio LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_title LIKE CONCAT ('%', :search, '%')) "
			+ "Order By e_id desc\r\n"
			,nativeQuery=true)
	int getsearchlistcount(String search);
	
	
	//페이징을 위한 데이터 조회
	@Query(value = "SELECT * FROM estimate WHERE (e_region LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_dress LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_makeup LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_honeymoon LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_writer LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_studio LIKE CONCAT('%', :search, '%') \r\n"
			+ "OR e_title LIKE CONCAT ('%', :search, '%')) "
			+ "Order By e_id desc\r\n LIMIT :start , :limit"
			,nativeQuery=true)
	List<Estimate> getsearchlistpageing(int start, int limit, String search);
	
	
	
	
	
	//모든 데이터 조회
	@Query("SELECT e FROM Estimate e JOIN FETCH UserLogin u ON e.writer = u.email ORDER BY e.id DESC")
	List<Estimate> findAllByOrderByIdDesc();
	
	
	@Transactional
	@Modifying
	@Query(value="UPDATE estimate SET e_viewcount = e_viewcount+1 WHERE e_id = :num",nativeQuery=true)
	void increaseViewCount(int num);

	
	Estimate findById(Long id);


	List<Estimate> findAllByWriter(String userEmail);
		

	void deleteById(Long estimateId);
	
	
	@Query(value = "SELECT * FROM estimate Order By e_id desc LIMIT :start , :limit",nativeQuery=true)
	List<Estimate> pageinglist(int start, int limit);
	

}





