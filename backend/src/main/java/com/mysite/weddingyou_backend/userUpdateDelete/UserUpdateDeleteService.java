package com.mysite.weddingyou_backend.userUpdateDelete;

import java.util.Optional;
import java.util.Properties;
import java.util.Random;
import java.time.LocalDateTime;

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
import org.springframework.transaction.annotation.Transactional;

import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDelete;


@Service
@Transactional
public class UserUpdateDeleteService {
	 
	@Autowired
	private UserUpdateDeleteRepository userRepository;
	
	public UserUpdateDelete getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
	
	
	public void save(UserUpdateDelete user) {
		//repository의 save 메소드 소환
		userRepository.save(user);
		// repository의 save 메서드 호출(조건. entity 객체를 넘겨줘야 함)
	}
	
	public void delete(UserUpdateDelete user) {
		//repository의 delete 메소드 소환
		userRepository.delete(user);
		// repository의 delete 메서드 호출(조건. entity 객체를 넘겨줘야 함)
	}
	
	
}
