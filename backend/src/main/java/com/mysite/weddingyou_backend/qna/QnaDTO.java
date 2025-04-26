package com.mysite.weddingyou_backend.qna;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QnaDTO {
    private long qnaId;
    private String qnaWriter;
    private String qnaTitle;
    private String qnaContent;
    
	private String qnaImg;

    private LocalDateTime qnaWriteDate;
    
    private int qnaViewCount;
    
    public static QnaDTO fromEntity(Qna qna) {
        QnaDTO qnaDTO = new QnaDTO();
        qnaDTO.setQnaId(qna.getQnaId());
        qnaDTO.setQnaWriter(qna.getQnaWriter());
        qnaDTO.setQnaTitle(qna.getQnaTitle());
        qnaDTO.setQnaContent(qna.getQnaContent());
		qnaDTO.setQnaImg(qna.getQnaImg());
        qnaDTO.setQnaWriteDate(qna.getQnaWriteDate());
        qnaDTO.setQnaViewCount(qna.getQnaViewCount());
        return qnaDTO;
    }
}