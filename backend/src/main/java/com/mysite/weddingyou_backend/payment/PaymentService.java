package com.mysite.weddingyou_backend.payment;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mysite.weddingyou_backend.estimate.Estimate;
import com.mysite.weddingyou_backend.estimate.EstimateRepository;


@Service
@Transactional
public class PaymentService {
	
	@Autowired
	PaymentRepository paymentRepository;
	
	@Autowired
	EstimateRepository estimateRepository;
	
//    이메일로 조회 부분인데 필요한가??
//    public List<Payment> getPaymentsByUserEmail(String userEmail) {
//        return paymentRepository.findByUserEmail(userEmail);
//    }
    
	// 결제 정보를 ID를 기반으로 조회하는 메서드
    public Payment getPaymentById(Long paymentId) {
    	return paymentRepository.findByPaymentId(paymentId);
    }
    
    // 결제 정보를 DB에 저장하는 메서드
    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }
    
    public List<Payment> getPaymentData(Long estimateId){
        List<Payment> payments = paymentRepository.findByEstimateId(estimateId);
        if(payments != null){
            return payments;
        }else{
            return null;
        }

    }

    public List<Payment> getPaymentsList(List<Long> estimateIds) {
        return paymentRepository.findByEstimateIdIn(estimateIds);
    }
    
    public List<Estimate> getEstimateList(String userEmail){
    	return estimateRepository.findAllByWriter(userEmail);
    }

   
}