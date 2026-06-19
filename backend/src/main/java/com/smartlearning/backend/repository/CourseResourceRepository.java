package com.smartlearning.backend.repository;

import com.smartlearning.backend.model.CourseResource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseResourceRepository extends JpaRepository<CourseResource, Long> {
    List<CourseResource> findByCourseIdOrderByCreatedAtDesc(Long courseId);
}
