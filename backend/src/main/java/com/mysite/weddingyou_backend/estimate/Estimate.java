package com.mysite.weddingyou_backend.estimate;

import java.time.LocalDate;
import java.util.List;



import com.mysite.weddingyou_backend.plannerProfile.PlannerProfileDTO;
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
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="Estimate")
public class Estimate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "e_id")
    private Long id;

    @Column(name = "e_title")
    private String title;		//게시글 제목

    @Column(name = "e_requirement")
    private String requirement;	//게시글 요구사항(요청사항)

    @Column(name = "e_budget")
    private int budget;			//예산

    @Column(name = "e_writer") //글쓴이
    private String writer;
    
    @Column(name= "e_weddingdate")	//결혼 예정일
    private String weddingdate;
    
    
    @Column(name = "e_img",length=5000)
    private String img;			//추가 이미지

    @Column(name = "e_date")
    private LocalDate date;		//날짜

    @Column(name = "e_region")
    private String region;		//지역

    @Column(name = "e_dress")
    private String dress;		//드레스

    @Column(name = "e_makeup")
    private String makeup;		//화장

    @Column(name = "e_honeymoon")
    private String honeymoon;	//신혼여행지
	
    @Column (name = "e_studio") //스튜디오
    private String studio;
    
    @Column (name = "e_matchstatus")//매칭상태
    private boolean matchstatus;     
    
    @Column (name = "e_viewcount") //조회수
    private int viewcount;
    
    @Column (name = "e_plannerMatching") //plannermatching
    private String plannermatching;
    
    @Column (name = "e_userMatching") //usermatching
    private String userMatching;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "e_writer", referencedColumnName = "email", insertable = false, updatable = false)
    private UserLogin user;

    @Transient
    private List<PlannerProfileDTO> plannerProfiles;
}
	
	





    
	
	
	
	

