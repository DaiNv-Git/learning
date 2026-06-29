package com.smartlearning.backend.core.repository;

import com.smartlearning.backend.core.entity.CourseDiscussion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseDiscussionRepository extends JpaRepository<CourseDiscussion, Long> {
    List<CourseDiscussion> findByCourseIdOrderByCreatedAtDesc(Long courseId);
}
