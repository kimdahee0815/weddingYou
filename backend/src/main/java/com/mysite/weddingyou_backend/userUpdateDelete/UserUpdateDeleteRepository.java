package com.mysite.weddingyou_backend.userUpdateDelete;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mysite.weddingyou_backend.userLogin.UserLogin;

import jakarta.transaction.Transactional;


@Repository
public interface UserUpdateDeleteRepository extends JpaRepository<UserUpdateDelete, Long> {
	//이메일로 회원 정보 조회(select * from User where email=?)
	UserUpdateDelete findByEmail(String Email); //optional은 null방지..?
	
	//insert, update, delete 할때 필요함
	@Modifying
	@Transactional
	@Query(value="update user set password = :password where email = :email", nativeQuery=true)
	public int updatePassword(String email, String password);
}
