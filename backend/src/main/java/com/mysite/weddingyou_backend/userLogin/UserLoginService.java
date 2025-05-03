package com.mysite.weddingyou_backend.userLogin;

import java.util.Optional;
import java.util.Properties;
import java.util.Random;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
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


@Service
@Transactional
public class UserLoginService {
	 
	@Autowired
	private UserLoginRepository userRepository;
	
	public void save(UserLogin user) {
		//repository의 save 메소드 소환
		userRepository.save(user);
		// repository의 save 메서드 호출(조건. entity 객체를 넘겨줘야 함)
	}
	
	public UserLogin login(UserLogin loginUser) {
		/*
		 1. 회원이 입력한 이메일로 DB에서 조회
		 2. DB에서 조회한 비밀번호와 사용자가 입력한 비밀번호가 일치하는지 판단
		 */
		UserLogin user = userRepository.findByEmail(loginUser.getEmail());
		//optional 객체가 되는거임(변경)
		
		if(user != null) {
			//User userData = user.get(); //get해야지 userentity 객체가 반환되어 저장
			//조회 결과가 있음(해당 이메일을 가진 회원 정보가 있다)
			if(user.getPassword().equals(loginUser.getPassword())) {
				//비밀번호 일치
				return user;
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
		return userRepository.updatePassword(email, password);
	}
	
	//서비스 임시비밀번호 추가내용
	public int sendTemporaryPassword(String email) {
		System.out.println(email); //잘 출력되는지 확인하기 위함
	    UserLogin optionalUser = userRepository.findByEmail(email);
	    
	    if (optionalUser == null) {
	        return 0;
	    }
	    
	    String temporaryPassword = generateTemporaryPassword();
	    optionalUser.setPassword(temporaryPassword);
	    userRepository.save(optionalUser);
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
        String host = "smtp.gmail.com"; // 메일 서버 호스트
        String port = "465"; // 메일 서버 포트
				Properties config = new Properties();
				try (InputStream input = getClass().getClassLoader().getResourceAsStream("config.properties")) {
    			if (input == null) {
        		throw new FileNotFoundException("config.properties not found in resources folder");
    			}
    			config.load(input);
				} catch (IOException ex) {
    			ex.printStackTrace();
				}

				String senderEmail = config.getProperty("gmail.address");
				String senderPassword = config.getProperty("gmail.appPassword");

        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", host);
        properties.put("mail.smtp.port", port);
        properties.put("mail.smtp.ssl.enable", "true");
        properties.put("mail.smtp.ssl.trust", "smtp.gmail.com");

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
            message.setSubject("🔐 Your Temporary Password from WeddingYou");
						message.setText(
    					"Dear Valued User,\n\n" +
    					"This is WeddingYou 🕊️. Please use the following temporary password to log in to your account:\n\n" +
    					"🔑 Temporary Password: " + temporaryPassword + "\n\n" +
    					"For your security 🔒, we recommend that you change your password after logging in.\n\n" +
    					"Best regards,\n" +
    					"WeddingYou Support Team 💌"
						);
            Transport.send(message);
        } catch (MessagingException e) {
						e.printStackTrace();
            throw new RuntimeException("이메일 전송 중 오류가 발생했습니다.");
        }
    }
}
