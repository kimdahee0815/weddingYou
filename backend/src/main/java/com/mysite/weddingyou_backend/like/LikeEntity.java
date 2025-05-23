package com.mysite.weddingyou_backend.like;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.mysite.weddingyou_backend.item.Item;
import com.mysite.weddingyou_backend.plannerLogin.PlannerLogin;
import com.mysite.weddingyou_backend.plannerUpdateDelete.PlannerUpdateDelete;
import com.mysite.weddingyou_backend.userLogin.UserLogin;
import com.mysite.weddingyou_backend.userUpdateDelete.UserUpdateDelete;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"useremail", "item_id"}),
    @UniqueConstraint(columnNames = {"planneremail", "item_id"})
})
public class LikeEntity  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_id")
    private Long likeId;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id")
    private Item item;
	
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "useremail", referencedColumnName="email")
    private UserLogin user;
    
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "planneremail", referencedColumnName="email")
    private PlannerLogin planner;

    @Column(name = "location")
    private String location;

    @Column(name = "like_write_date")
    private LocalDateTime likeWriteDate;
}

