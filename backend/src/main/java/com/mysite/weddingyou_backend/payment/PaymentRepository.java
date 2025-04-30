package com.mysite.weddingyou_backend.payment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>{
	
	Payment findByPaymentId(Long paymentId);
	
	List<Payment> findAllByUserEmail(String userEmail);
	
	void deleteByEstimateId(Long estimateId);

	List<Payment> findByEstimateIdIn(List<Long> estimateIds);

	List<Payment> findByEstimateId(Long estimateId);
}