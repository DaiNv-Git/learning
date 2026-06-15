package com.smartlearning.backend.core.repository;
import com.smartlearning.backend.core.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CourseRepository extends JpaRepository<Course, Long> {}
