package com.mysite.weddingyou_backend.estimate;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

public interface EstimateRepository extends JpaRepository<Estimate, Integer> {

    // 전체 게시글 개수 조회
    @Query(value = "SELECT COUNT(*) FROM Estimate", nativeQuery = true)
    int getcount();

    // 검색어를 통한 조회
    @Query(value = "SELECT * FROM Estimate WHERE " +
            "(e_region ILIKE '%' || :search || '%' " +
            "OR e_dress ILIKE '%' || :search || '%' " +
            "OR e_makeup ILIKE '%' || :search || '%' " +
            "OR e_honeymoon ILIKE '%' || :search || '%' " +
            "OR e_studio ILIKE '%' || :search || '%' " +
            "OR e_weddingdate::text ILIKE '%' || :search || '%' " +
            "OR e_date::text ILIKE '%' || :search || '%' " +
            "OR e_requirement ILIKE '%' || :search || '%' " +
            "OR TO_CHAR(e_date, 'YYYY-MM') = :search " +
            "OR TO_CHAR(e_date, 'MM-DD') = :search " +
            "OR TO_CHAR(e_date, 'YYYY') = :search " +
            "OR TO_CHAR(e_date, 'MM') = :search " +
            "OR TO_CHAR(e_date, 'DD') = :search " +
            "OR e_title ILIKE '%' || :search || '%') " +
            "ORDER BY e_id DESC",
            nativeQuery = true)
    List<Estimate> getsearchlist(@Param("search") String search);

    // 페이징을 위한 검색어 개수 조회
    @Query(value = "SELECT COUNT(*) FROM Estimate WHERE " +
            "(e_region ILIKE '%' || :search || '%' " +
            "OR e_dress ILIKE '%' || :search || '%' " +
            "OR e_makeup ILIKE '%' || :search || '%' " +
            "OR e_honeymoon ILIKE '%' || :search || '%' " +
            "OR e_writer ILIKE '%' || :search || '%' " +
            "OR e_studio ILIKE '%' || :search || '%' " +
            "OR e_title ILIKE '%' || :search || '%')",
            nativeQuery = true)
    int getsearchlistcount(@Param("search") String search);

    // 페이징을 위한 데이터 조회
    @Query(value = "SELECT * FROM Estimate WHERE " +
            "(e_region ILIKE '%' || :search || '%' " +
            "OR e_dress ILIKE '%' || :search || '%' " +
            "OR e_makeup ILIKE '%' || :search || '%' " +
            "OR e_honeymoon ILIKE '%' || :search || '%' " +
            "OR e_writer ILIKE '%' || :search || '%' " +
            "OR e_studio ILIKE '%' || :search || '%' " +
            "OR e_title ILIKE '%' || :search || '%') " +
            "ORDER BY e_id DESC OFFSET :start LIMIT :limit",
            nativeQuery = true)
    List<Estimate> getsearchlistpageing(@Param("start") int start,
                                        @Param("limit") int limit,
                                        @Param("search") String search);

    // 모든 데이터 조회
    @Query("SELECT e FROM Estimate e JOIN FETCH UserLogin u ON e.writer = u.email ORDER BY e.id DESC")
    List<Estimate> findAllByOrderByIdDesc();

    @Transactional
    @Modifying
    @Query(value = "UPDATE Estimate SET e_viewcount = e_viewcount + 1 WHERE e_id = :num", nativeQuery = true)
    void increaseViewCount(@Param("num") int num);

    Estimate findById(Long id);

    List<Estimate> findAllByWriter(String userEmail);

    void deleteById(Long estimateId);

    @Query(value = "SELECT * FROM Estimate ORDER BY e_id DESC OFFSET :start LIMIT :limit", nativeQuery = true)
    List<Estimate> pageinglist(@Param("start") int start, @Param("limit") int limit);
}
