package com.smartlearning.backend.repository;

import com.smartlearning.backend.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findTop6ByOrderByCreatedAtDesc();
}
