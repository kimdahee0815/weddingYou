package com.mysite.weddingyou_backend.mypageAdmin;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import jakarta.transaction.Transactional;


@Repository
public interface MypageAdminRepository extends JpaRepository<MypageAdmin, Long> {
	
	boolean existsByUserEmail(String userEmail);
    boolean existsByPlannerEmail(String plannerEmail);
	
  	@Modifying
  	@Transactional
  	@Query(value="update mypageAdmin set user_name = :user_name, user_password = :user_password, user_phoneNum = :user_phoneNum where admin_id = :admin_id", nativeQuery=true)
  	public int updateUser(Long admin_id, String user_name, String user_password, String user_phoneNum);
  	
  	@Modifying
  	@Transactional
  	@Query(value="update mypageAdmin set planner_name = :planner_name, planner_password = :planner_password, planner_phoneNum = :planner_phoneNum where admin_id = :admin_id", nativeQuery=true)
  	public int updatePlanner(Long admin_id, String planner_name, String planner_password, String planner_phoneNum);
  	
  	//전체 데이터 개수 조회
  	@Query(value = "select count(*) from mypageAdmin", nativeQuery=true)
  	int getCount();
  	
  	//검색
  	@Query(value = "SELECT * FROM mypageAdmin WHERE (user_name LIKE CONCAT('%', :search, '%') \r\n"
            + "OR user_email LIKE CONCAT('%', :search, '%') \r\n"
            + "OR user_phoneNum LIKE CONCAT('%', :search, '%') \r\n"
            + "OR DATE(user_join_date) = DATE(:search) \r\n"
            + "OR TO_CHAR(user_join_date, 'YYYY-MM') = :search \r\n"
            + "OR TO_CHAR(user_join_date, 'MM-DD') = :search \r\n"
            + "OR TO_CHAR(user_join_date, 'YYYY') = :search \r\n"
            + "OR TO_CHAR(user_join_date, 'MM') = :search \r\n"
            + "OR TO_CHAR(user_join_date, 'DD') = :search \r\n"
            + "OR planner_name LIKE CONCAT('%', :search, '%') \r\n"
            + "OR planner_email LIKE CONCAT('%', :search, '%') \r\n"
            + "OR planner_phoneNum LIKE CONCAT('%', :search, '%') \r\n"
            + "OR DATE(planner_join_date) = DATE(:search) \r\n"
            + "OR TO_CHAR(planner_join_date, '%Y-%m') = :search \r\n"
            + "OR TO_CHAR(planner_join_date, '%m-%d') = :search \r\n"
            + "OR TO_CHAR(planner_join_date, '%Y') = :search \r\n"
            + "OR TO_CHAR(planner_join_date, '%m') = :search \r\n"
            + "OR TO_CHAR(planner_join_date, '%d') = :search \r\n"
            + "OR UsersType LIKE CONCAT('%', :search, '%'))"
            + "ORDER BY admin_id ASC \r\n" ,
            nativeQuery = true)
  	Page<MypageAdmin> getSearchList(@Param("search") String search, Pageable pageable);
  	
    //검색 데이터 개수 조회
  	@Query(value = "select count(*) from mypageAdmin where (user_name LIKE CONCAT('%', :search, '%') \r\n"
  			+ "OR user_email LIKE CONCAT('%', :search, '%') \r\n"
            + "OR user_phoneNum LIKE CONCAT('%', :search, '%') \r\n"
            + "OR DATE(user_join_date) = DATE(:search) \r\n"
            + "OR TO_CHAR(user_join_date, 'YYYY-MM') = :search \r\n"
            + "OR TO_CHAR(user_join_date, 'MM-DD') = :search \r\n"
            + "OR TO_CHAR(user_join_date, 'YYYY') = :search \r\n"
            + "OR TO_CHAR(user_join_date, 'MM') = :search \r\n"
            + "OR TO_CHAR(user_join_date, 'DD') = :search \r\n"
            + "OR planner_name LIKE CONCAT('%', :search, '%') \r\n"
            + "OR planner_email LIKE CONCAT('%', :search, '%') \r\n"
            + "OR planner_phoneNum LIKE CONCAT('%', :search, '%') \r\n"
            + "OR DATE(planner_join_date) = DATE(:search) \r\n"
            + "OR TO_CHAR(planner_join_date, '%Y-%m') = :search \r\n"
            + "OR TO_CHAR(planner_join_date, '%m-%d') = :search \r\n"
            + "OR TO_CHAR(planner_join_date, '%Y') = :search \r\n"
            + "OR TO_CHAR(planner_join_date, '%m') = :search \r\n"
            + "OR TO_CHAR(planner_join_date, '%d') = :search \r\n"
            + "OR UsersType LIKE CONCAT('%', :search, '%'))"
  			, nativeQuery=true)
  	int getSearchCount(String search);
  	
  	MypageAdmin findByUserEmail(String useremail);
  	MypageAdmin findByPlannerEmail(String planneremail);
}
