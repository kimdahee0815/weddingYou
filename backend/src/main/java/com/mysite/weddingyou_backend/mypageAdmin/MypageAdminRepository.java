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
    @Query(value = "UPDATE MypageAdmin SET user_name = :user_name, user_password = :user_password, user_phoneNum = :user_phoneNum " +
            "WHERE admin_id = :admin_id", nativeQuery = true)
    int updateUser(@Param("admin_id") Long admin_id,
                   @Param("user_name") String user_name,
                   @Param("user_password") String user_password,
                   @Param("user_phoneNum") String user_phoneNum);

    @Modifying
    @Transactional
    @Query(value = "UPDATE MypageAdmin SET planner_name = :planner_name, planner_password = :planner_password, planner_phoneNum = :planner_phoneNum " +
            "WHERE admin_id = :admin_id", nativeQuery = true)
    int updatePlanner(@Param("admin_id") Long admin_id,
                      @Param("planner_name") String planner_name,
                      @Param("planner_password") String planner_password,
                      @Param("planner_phoneNum") String planner_phoneNum);

    // 전체 데이터 개수 조회
    @Query(value = "SELECT COUNT(*) FROM MypageAdmin", nativeQuery = true)
    int getCount();

    // 검색
    @Query(value = "SELECT * FROM MypageAdmin WHERE " +
            "(user_name ILIKE '%' || :search || '%' " +
            "OR user_email ILIKE '%' || :search || '%' " +
            "OR user_phoneNum ILIKE '%' || :search || '%' " +
            "OR DATE(user_join_date) = DATE(:search) " +
            "OR TO_CHAR(user_join_date, 'YYYY-MM') = :search " +
            "OR TO_CHAR(user_join_date, 'MM-DD') = :search " +
            "OR TO_CHAR(user_join_date, 'YYYY') = :search " +
            "OR TO_CHAR(user_join_date, 'MM') = :search " +
            "OR TO_CHAR(user_join_date, 'DD') = :search " +
            "OR planner_name ILIKE '%' || :search || '%' " +
            "OR planner_email ILIKE '%' || :search || '%' " +
            "OR planner_phoneNum ILIKE '%' || :search || '%' " +
            "OR DATE(planner_join_date) = DATE(:search) " +
            "OR TO_CHAR(planner_join_date, 'YYYY-MM') = :search " +
            "OR TO_CHAR(planner_join_date, 'MM-DD') = :search " +
            "OR TO_CHAR(planner_join_date, 'YYYY') = :search " +
            "OR TO_CHAR(planner_join_date, 'MM') = :search " +
            "OR TO_CHAR(planner_join_date, 'DD') = :search " +
            "OR UsersType ILIKE '%' || :search || '%') " +
            "ORDER BY admin_id ASC",
            nativeQuery = true)
    Page<MypageAdmin> getSearchList(@Param("search") String search, Pageable pageable);

    // 검색 데이터 개수 조회
    @Query(value = "SELECT COUNT(*) FROM MypageAdmin WHERE " +
            "(user_name ILIKE '%' || :search || '%' " +
            "OR user_email ILIKE '%' || :search || '%' " +
            "OR user_phoneNum ILIKE '%' || :search || '%' " +
            "OR DATE(user_join_date) = DATE(:search) " +
            "OR TO_CHAR(user_join_date, 'YYYY-MM') = :search " +
            "OR TO_CHAR(user_join_date, 'MM-DD') = :search " +
            "OR TO_CHAR(user_join_date, 'YYYY') = :search " +
            "OR TO_CHAR(user_join_date, 'MM') = :search " +
            "OR TO_CHAR(user_join_date, 'DD') = :search " +
            "OR planner_name ILIKE '%' || :search || '%' " +
            "OR planner_email ILIKE '%' || :search || '%' " +
            "OR planner_phoneNum ILIKE '%' || :search || '%' " +
            "OR DATE(planner_join_date) = DATE(:search) " +
            "OR TO_CHAR(planner_join_date, 'YYYY-MM') = :search " +
            "OR TO_CHAR(planner_join_date, 'MM-DD') = :search " +
            "OR TO_CHAR(planner_join_date, 'YYYY') = :search " +
            "OR TO_CHAR(planner_join_date, 'MM') = :search " +
            "OR TO_CHAR(planner_join_date, 'DD') = :search " +
            "OR UsersType ILIKE '%' || :search || '%')",
            nativeQuery = true)
    int getSearchCount(@Param("search") String search);

    MypageAdmin findByUserEmail(String useremail);
    MypageAdmin findByPlannerEmail(String planneremail);
}