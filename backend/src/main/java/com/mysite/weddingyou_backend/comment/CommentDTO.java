package com.mysite.weddingyou_backend.comment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentDTO {
    private Long commentId;
    
	private String commentWriter;

    private String commentContent;

    public static CommentDTO fromEntity(Comment comment) {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setCommentWriter(comment.getCommentWriter());
        commentDTO.setCommentContent(comment.getCommentContent());
        return commentDTO;
    }

}