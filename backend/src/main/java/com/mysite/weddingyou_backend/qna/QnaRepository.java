package com.mysite.weddingyou_backend.qna;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QnaRepository extends JpaRepository<Qna, Long> {
    List<Qna> findByQnaTitleContaining(String keyword);
    List<Qna> findAllByQnaWriter(String email);
}