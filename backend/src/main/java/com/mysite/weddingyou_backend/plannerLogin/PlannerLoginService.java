package com.mysite.weddingyou_backend.plannerLogin;

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

import jakarta.transaction.Transactional;


@Service
@Transactional
public class PlannerLoginService {
	 
	@Autowired
	private PlannerLoginRepository plannerRepository;
	
	public void save(PlannerLogin planner) {
		//repository의 save 메소드 소환
		plannerRepository.save(planner);
		// repository의 save 메서드 호출(조건. entity 객체를 넘겨줘야 함)
	}
	
	public PlannerLogin login(PlannerLogin loginPlannner) {
		/*
		 1. 회원이 입력한 이메일로 DB에서 조회
		 2. DB에서 조회한 비밀번호와 사용자가 입력한 비밀번호가 일치하는지 판단
		 */
		PlannerLogin planner = plannerRepository.findByEmail(loginPlannner.getEmail());
		//optional 객체가 되는거임
		
		if(planner != null) {
			//Planner plannerData = planner.get(); //get해야지 plannerEntity 객체가 반환되어 저장
			//조회 결과가 있음(해당 이메일을 가진 회원 정보가 있다)
			if(planner.getPassword().equals(loginPlannner.getPassword())) {
				//비밀번호 일치
				return planner;
			}else {
				//비밀번호 불일치(로그인 실패)
				return null;
			}
		}else {
			//조회 결과가 없음(해당 이메일을 가진 회원 정보가 없다)
			return null;
		}
	}
	
	//비밀번호 변경
	public int updatePassword(String email, String password) {
		return plannerRepository.updatePassword(email, password);
	}
	
	//서비스 임시비밀번호 추가내용
	public int sendTemporaryPassword(String email) {
		System.out.println(email); //잘 출력되는지 확인
	    PlannerLogin optionalPlanner = plannerRepository.findByEmail(email);
	    
	    if (optionalPlanner == null) {
	        return 0;
	    }
	    
	    String temporaryPassword = generateTemporaryPassword();
	    optionalPlanner.setPassword(temporaryPassword);
	    plannerRepository.save(optionalPlanner);
	    sendEmail(email, temporaryPassword);
	    
	    return 1;
	    
	}

	//임시 비밀번호 생성
    private String generateTemporaryPassword() {
        int length = 10; // 임시 비밀번호의 길이 설정
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // 임시 비밀번호에 사용될 문자열
        StringBuilder builder = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            int randomIndex = new Random().nextInt(characters.length());
            char randomCharacter = characters.charAt(randomIndex);
            builder.append(randomCharacter);
        }

        return builder.toString();
    }

    //이메일 전송
    private void sendEmail(String email, String temporaryPassword) {
        String host = "smtp.naver.com"; // 메일 서버 호스트
        String port = "465"; // 메일 서버 포트
        String senderEmail = "weddingyou502@naver.com"; // 보내는 사람 이메일 주소
        String senderPassword = "weddingyou502!"; // 보내는 사람 이메일 비밀번호

        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", host);
        properties.put("mail.smtp.port", port);
        properties.put("mail.smtp.ssl.enable", "true");
        properties.put("mail.smtp.ssl.trust", "smtp.naver.com");

        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(senderEmail, senderPassword);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(senderEmail));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject("웨딩유 임시 비밀번호 발급 안내");
            message.setText("안녕하세요. 웨딩유 입니다:) 임시 비밀번호는 " + temporaryPassword + " 입니다.");
            Transport.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("이메일 전송 중 오류가 발생했습니다.");
        }
    }
}
