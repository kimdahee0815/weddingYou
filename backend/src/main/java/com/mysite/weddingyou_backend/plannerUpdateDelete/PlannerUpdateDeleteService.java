package com.mysite.weddingyou_backend.plannerUpdateDelete;

import java.util.Optional;
import java.util.Properties;
import java.util.Random;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mysite.weddingyou_backend.plannerRegister.PlannerRegister;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDelete;

import jakarta.transaction.Transactional;


@Service
@Transactional
public class PlannerUpdateDeleteService {
	 
	@Autowired
	private PlannerUpdateDeleteRepository plannerRepository;
	
	public PlannerUpdateDelete getPlannerByEmail(String email) {
		//System.out.println(plannerRepository.findByEmail(email));
        return plannerRepository.findByEmail(email);
    }
	
	public void save(PlannerUpdateDelete planner) {
		//repository의 save 메소드 소환
		plannerRepository.save(planner);
		// repository의 save 메서드 호출(조건. entity 객체를 넘겨줘야 함)
	}
	
	public void delete(PlannerUpdateDelete planner) {
		//repository의 delete 메소드 소환
		plannerRepository.delete(planner);
		// repository의 delete 메서드 호출(조건. entity 객체를 넘겨줘야 함)
	}
	

}
