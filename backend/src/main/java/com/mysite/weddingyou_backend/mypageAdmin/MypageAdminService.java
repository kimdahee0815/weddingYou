package com.mysite.weddingyou_backend.mypageAdmin;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mysite.weddingyou_backend.plannerLogin.PlannerLogin;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLoginRepository;
import com.mysite.weddingyou_backend.userLogin.UserLogin;
import com.mysite.weddingyou_backend.userLogin.UserLoginRepository;


@Service
@Transactional
public class MypageAdminService {
	
	@Autowired
	MypageAdminRepository mypageAdminRepository;

	@Autowired
  private UserLoginRepository userLoginRepository;

	@Autowired
  private PlannerLoginRepository plannerLoginRepository;

	public void initializeMypageAdmins() {
		List<UserLogin> users = userLoginRepository.findAll();
		List<PlannerLogin> planners = plannerLoginRepository.findAll();

		for (UserLogin user : users) {
				if (mypageAdminRepository.findByUserEmail(user.getEmail()) == null) {
						MypageAdmin userAdmin = new MypageAdmin();
						userAdmin.setType("user");
						userAdmin.setUserEmail(user.getEmail());
						userAdmin.setUserName(user.getName());
						userAdmin.setUserPassword(user.getPassword());
						userAdmin.setUserGender(user.getGender());
						userAdmin.setUserPhoneNum(user.getPhoneNum());
						userAdmin.setUserJoinDate(user.getUserJoinDate());
						mypageAdminRepository.save(userAdmin);
				}
		}

		for (PlannerLogin planner : planners) {
				if (mypageAdminRepository.findByPlannerEmail(planner.getEmail()) == null) {
						MypageAdmin plannerAdmin = new MypageAdmin();
						plannerAdmin.setType("planner");
						plannerAdmin.setPlannerEmail(planner.getEmail());
						plannerAdmin.setPlannerName(planner.getName());
						plannerAdmin.setPlannerPassword(planner.getPassword());
						plannerAdmin.setPlannerGender(planner.getGender());
						plannerAdmin.setPlannerPhoneNum(planner.getPhoneNum());
						plannerAdmin.setPlannerCareerYears(planner.getPlannerCareerYears());
						plannerAdmin.setPlannerJoinDate(planner.getPlannerJoinDate());
						mypageAdminRepository.save(plannerAdmin);
				}
		}
	}

	
	public int updateUser(Long admin_id, String user_name, String user_password, String user_phoneNum) {
		return mypageAdminRepository.updateUser(admin_id, user_name, user_password, user_phoneNum);
	}
	
	public int updatePlanner(Long admin_id, String planner_name, String planner_password, String planner_phoneNum) {
		return mypageAdminRepository.updatePlanner(admin_id, planner_name, planner_password, planner_phoneNum);
	}
	
	//전체 데이터 개수 조회
	public int getCount() {
		int count = mypageAdminRepository.getCount();
		return count;
	}
	
	//검색
	public Page<MypageAdmin> getSearchList(String search, Pageable pageable){
		Page<MypageAdmin> list = mypageAdminRepository.getSearchList(search, pageable);
		return list;
	}
	
	//검색 데이터 개수 조회
	public int getSearchCount(String search) {
		int count = mypageAdminRepository.getSearchCount(search);
		return count;
	}
	
	//사용자 정보 삭제
	public void delete(Long adminId) {
		mypageAdminRepository.deleteById(adminId);
	}
	
	public MypageAdmin getMypageAdmin(Long adminId) {
        return mypageAdminRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("MypageAdmin not found with adminId: " + adminId));
    }

}
