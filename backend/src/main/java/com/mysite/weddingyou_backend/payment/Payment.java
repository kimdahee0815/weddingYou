package com.mysite.weddingyou_backend.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mysite.weddingyou_backend.item.Item;
import com.mysite.weddingyou_backend.payment.PaymentCallbackRequest.PaymentStatus;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLogin;
import com.mysite.weddingyou_backend.userLogin.UserLogin;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Payment")
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "payment_id")
	private Long paymentId; //결제ID
	
	@Column(name = "estimate_id")
	private Long estimateId; //견적서 id
	
	@Column(name = "price", precision = 10, scale = 2, nullable = false)
	private BigDecimal price; //상품 가격
	
	@Column(name = "quantity", nullable = false)
	private Integer quantity; //상품 수량
	
	@Column(name = "payment_method", nullable = false)
	private String paymentMethod; //결제 수단
	
	@Column(name = "payment_amount", precision = 10, scale = 2, nullable = false)
	private BigDecimal paymentAmount; //결제 금액
	
	@Column(name = "payment_status", nullable = false)
	private String paymentStatus; //결제 상태
	
	@Column(name = "payment_date", nullable = true)
	private LocalDateTime paymentDate; //결제 일시
	
	@Column(name = "deposit_amount", precision = 10, scale = 2, nullable = false)
	private BigDecimal depositAmount; //계약금 결제 금액
	
	@Column(name = "deposit_status", nullable = false)
	private String depositStatus; //계약금 결제 상태
	
	@Column(name = "deposit_date", nullable = true)
	private LocalDateTime depositDate; //계약금 결제 일시
	
	@Column(name = "payment_type", nullable = false)
	private String paymentType; //계약금or전체금액
	
	@Column(name = "user_email", nullable = false)
	private String userEmail;

	@Column(name = "planner_email", nullable = false)
	private String plannerEmail;
	
//	@Column(name = "item_id", nullable = false)
//	private Long itemId;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name = "user_email", referencedColumnName = "email", insertable = false, updatable = false, nullable = false)
	private UserLogin user;

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name = "planner_email", referencedColumnName = "email", insertable = false, updatable = false, nullable = false)
	private PlannerLogin planner;

//	@ManyToOne(fetch=FetchType.LAZY)
//	@JoinColumn(name = "item_id", referencedColumnName = "item_id", insertable = false, updatable = false, nullable = false)
//	private Item item;
	
}