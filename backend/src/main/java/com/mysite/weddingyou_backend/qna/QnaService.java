package com.mysite.weddingyou_backend.qna;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.mysite.weddingyou_backend.comment.Comment;
import com.mysite.weddingyou_backend.comment.CommentDTO;
import com.mysite.weddingyou_backend.comment.CommentRepository;
import com.mysite.weddingyou_backend.notice.Notice;

@Service
public class QnaService {
    private final QnaRepository qnaRepository;
    private final CommentRepository commentRepository;

    public QnaService(QnaRepository qnaRepository, CommentRepository commentRepository) {
        this.qnaRepository = qnaRepository;
        this.commentRepository = commentRepository;
    }

    public QnaDTO createQna(QnaDTO qnaDTO) {
        Qna qna = new Qna();
        qna.setQnaWriter(qnaDTO.getQnaWriter());
        qna.setQnaViewCount(qnaDTO.getQnaViewCount());
        qna.setQnaTitle(qnaDTO.getQnaTitle());
        qna.setQnaContent(qnaDTO.getQnaContent());
        qna.setQnaWriteDate(LocalDateTime.now());
        qna.setQnaImg(qnaDTO.getQnaImg());
        Qna savedQna = qnaRepository.save(qna);
        return QnaDTO.fromEntity(savedQna);
    }

    public QnaDTO updateQna(Long qnaId, QnaDTO qnaDTO) {
        Qna qna = qnaRepository.findById(qnaId).orElseThrow(() -> new IllegalArgumentException("Q&A not found."));
        //qna.setQnaWriter(qnaDTO.getQnaWriter());
        qna.setQnaTitle(qnaDTO.getQnaTitle());
        qna.setQnaContent(qnaDTO.getQnaContent());
        qna.setQnaWriteDate(LocalDateTime.now());
        if(qnaDTO.getQnaImg() != null) {
            qna.setQnaImg(qnaDTO.getQnaImg());
        } else {
            qna.setQnaImg(qna.getQnaImg());
        }
        qna.setQnaImg(qnaDTO.getQnaImg());
        Qna updatedQna = qnaRepository.save(qna);
        return QnaDTO.fromEntity(updatedQna);
    }

    public void deleteQna(Long qnaId) {
        qnaRepository.deleteById(qnaId);
    }

    public QnaDTO getQnaById(Long qnaId) {
        Qna qna = qnaRepository.findById(qnaId).orElseThrow(() -> new IllegalArgumentException("Q&A not found."));
        return QnaDTO.fromEntity(qna);
    }

    public List<Qna> searchQnas(String keyword) {
        List<Qna> qnas = qnaRepository.findByQnaTitleContaining(keyword);
        return qnas;
    }

    public List<QnaDTO> getAllQnas() {
        List<Qna> qnas = qnaRepository.findAll();
        return qnas.stream().map(QnaDTO::fromEntity).collect(Collectors.toList());
    }
    
    public List<Qna> getAllQnas2() {
        List<Qna> qnas = qnaRepository.findAll();
        return qnas;
    }

    public CommentDTO createComment(Long qnaId, CommentDTO commentDTO) {
        Qna qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new IllegalArgumentException("Q&A not found."));

        Comment comment = new Comment();
        comment.setCommentContent(commentDTO.getCommentContent());
        comment.setQna(qna);

        qna.getComments().add(comment);
        commentRepository.save(comment);

        return CommentDTO.fromEntity(comment);
    }

    public CommentDTO updateComment(Long commentId, CommentDTO commentDTO) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found."));

        comment.setCommentContent(commentDTO.getCommentContent());

        commentRepository.save(comment);

        return CommentDTO.fromEntity(comment);
    }

    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found."));

        commentRepository.delete(comment);
    }
    
    public void save(Qna qna) {
		qnaRepository.save(qna);
	}
    
    public Optional<Qna> getQnaById2(Long qnaId) {
    	
		return qnaRepository.findById(qnaId);
	}
}