package com.mysite.weddingyou_backend.review;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

	List<Review> findAllByUserEmail(String userEmail);
	List<Review> findAllByPlannerEmail(String plannerEmail);
	Review findByEstimateId(Long estimateId);
	void deleteByEstimateId(Long estimateId);
}