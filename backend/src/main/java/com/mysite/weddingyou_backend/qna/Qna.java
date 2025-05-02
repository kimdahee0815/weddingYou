package com.mysite.weddingyou_backend.qna;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mysite.weddingyou_backend.comment.Comment;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Qna")
public class Qna {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "qna_id")
    private long qnaId;

    @Column(name = "qna_writer")
    private String qnaWriter;

    @Column(name = "qna_title")
    private String qnaTitle;

    @Column(name = "qna_content")
    private String qnaContent;
    
	@Column(name = "qna_attachedfile", length=1000000000)
	private String qnaImg;

    @Column(name = "qna_write_date")
    private LocalDateTime qnaWriteDate;
    
    @Column(name = "qna_viewcount")
    private int qnaViewCount;

    @JsonManagedReference
    @OneToMany(mappedBy = "qna", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();
}