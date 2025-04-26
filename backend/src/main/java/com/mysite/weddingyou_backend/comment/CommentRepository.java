package com.mysite.weddingyou_backend.comment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mysite.weddingyou_backend.qna.Qna;
import com.mysite.weddingyou_backend.review.Review;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
	List<Comment> findAllByReview(Review targetReview);
	List<Comment> findAllByQna(Qna targetQna);
}