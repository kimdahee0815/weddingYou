package com.mysite.weddingyou_backend.plannerLogin;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mysite.weddingyou_backend.plannerLogin.PlannerLogin;

import jakarta.transaction.Transactional;


@Repository
public interface PlannerLoginRepository extends JpaRepository<PlannerLogin, Long> {
	//이메일로 회원 정보 조회(select * from Planner where email=?)
	PlannerLogin findByEmail(String Email); //optional은 null방지..?
	
	//insert, update, delete 할때 필요함
	@Modifying
	@Transactional
	@Query(value="update \"Planner\" set password = :password where email = :email", nativeQuery=true)
	public int updatePassword(String email, String password);
	
	//mypageAdmin 부분에서 이름, 비밀번호, 휴대폰번호 수정시 사용
	@Modifying
	@Transactional
	@Query(value="update \"Planner\" set name = :planner_name, password = :planner_password, phone_number = :planner_phoneNum where email = :planner_email", nativeQuery=true)
	public int updatePlannerByEmail(@Param("planner_email") String email, @Param("planner_name") String plannerName, @Param("planner_password") String plannerPassword, @Param("planner_phoneNum") String plannerPhoneNum);
	
	//사용자 정보 저장
	PlannerLogin save(PlannerLogin planner);
	
    //사용자 정보 삭제
    @Modifying
    @Transactional
    @Query(value="DELETE FROM \"Planner\" WHERE email = :planner_email", nativeQuery=true)
    public int deleteByEmail(@Param("planner_email") String email);
}
