package com.mysite.weddingyou_backend.userLogin;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mysite.weddingyou_backend.userLogin.UserLogin;

import jakarta.transaction.Transactional;


@Repository
public interface UserLoginRepository extends JpaRepository<UserLogin, Long> {
	//이메일로 회원 정보 조회(select * from User where email=?)
	UserLogin findByEmail(String Email); //optional은 null방지..?
	
	//insert, update, delete 할때 필요함
	@Modifying
	@Transactional
	@Query(value="update user set password = :password where email = :email", nativeQuery=true)
	public int updatePassword(String email, String password);
	
	//mypageAdmin 부분에서 이름, 비밀번호, 휴대폰번호 수정시 사용
	@Modifying
	@Transactional
    @Query(value="UPDATE User SET name = :user_name, password = :user_password, phone_number = :user_phoneNum WHERE email = :user_email", nativeQuery=true)
    public int updateUserByEmail(@Param("user_email") String email, @Param("user_name") String userName, @Param("user_password") String userPassword, @Param("user_phoneNum") String userPhoneNum);
	
	// 사용자 정보 저장
    UserLogin save(UserLogin user);
    
    //사용자 정보 삭제
    @Modifying
    @Transactional
    @Query(value="DELETE FROM User WHERE email = :user_email", nativeQuery=true)
    public int deleteByEmail(@Param("user_email") String email);
}
