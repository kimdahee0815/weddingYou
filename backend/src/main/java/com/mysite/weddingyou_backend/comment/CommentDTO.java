package com.mysite.weddingyou_backend.comment;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentDTO {
    private Long commentId;
    
	private String commentWriter;

    private String commentContent;

    private String commentEmail;

    private LocalDateTime commentDate;

    private Long qnaId;

    private Long reviewId;

    public static CommentDTO fromEntity(Comment comment) {
        if (comment == null) return null;

        CommentDTO dto = new CommentDTO();
        dto.setCommentId(comment.getCommentId());
        dto.setCommentWriter(comment.getCommentWriter());
        dto.setCommentEmail(comment.getCommentEmail());
        dto.setCommentContent(comment.getCommentContent());
        dto.setCommentDate(comment.getCommentDate());

        if (comment.getReview() != null) {
            dto.setReviewId(comment.getReview().getReviewId());
        }

        if (comment.getQna() != null) {
            dto.setQnaId(comment.getQna().getQnaId());
        }

        return dto;
    }

}