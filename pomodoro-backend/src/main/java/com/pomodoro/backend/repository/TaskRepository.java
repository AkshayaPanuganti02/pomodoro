package com.pomodoro.backend.repository;

import com.pomodoro.backend.model.Task;
import com.pomodoro.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // Every read is scoped to the owner - a user can only ever see their own tasks
    List<Task> findByOwnerOrderByTaskDateAscIdAsc(User owner);

    Optional<Task> findByIdAndOwner(Long id, User owner);
}
