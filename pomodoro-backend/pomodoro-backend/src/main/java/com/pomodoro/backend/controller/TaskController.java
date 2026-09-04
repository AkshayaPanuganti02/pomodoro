package com.pomodoro.backend.controller;

import com.pomodoro.backend.dto.TaskDto;
import com.pomodoro.backend.model.User;
import com.pomodoro.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // @AuthenticationPrincipal comes from JwtAuthFilter, which already validated the
    // token and resolved it to a real User row - there is no way to pass a
    // different user's ID here, so cross-account access isn't possible via this API.

    @GetMapping
    public List<TaskDto> getTasks(@AuthenticationPrincipal User user) {
        return taskService.getAllTasks(user);
    }

    @PostMapping
    public TaskDto createTask(@AuthenticationPrincipal User user, @Valid @RequestBody TaskDto dto) {
        return taskService.createTask(user, dto);
    }

    @PutMapping("/{id}")
    public TaskDto updateTask(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody TaskDto dto
    ) {
        return taskService.updateTask(user, id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@AuthenticationPrincipal User user, @PathVariable Long id) {
        taskService.deleteTask(user, id);
    }
}
