package com.pomodoro.backend.service;

import com.pomodoro.backend.dto.TaskDto;
import com.pomodoro.backend.model.Task;
import com.pomodoro.backend.model.User;
import com.pomodoro.backend.repository.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<TaskDto> getAllTasks(User owner) {
        return taskRepository.findByOwnerOrderByTaskDateAscIdAsc(owner)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public TaskDto createTask(User owner, TaskDto dto) {

        Task task = new Task();
        task.setOwner(owner);
        task.setTitle(dto.getTitle().trim());
        task.setTaskDate(dto.getDate());
        task.setCompleted(false);
        task.setPomodorosCompleted(0);

        return toDto(taskRepository.save(task));
    }

    public TaskDto updateTask(User owner, Long taskId, TaskDto dto) {

        Task task = requireOwnedTask(owner, taskId);

        task.setTitle(dto.getTitle().trim());
        task.setCompleted(dto.isCompleted());
        task.setPomodorosCompleted(dto.getPomodorosCompleted());
        task.setTaskDate(dto.getDate());

        return toDto(taskRepository.save(task));
    }

    public void deleteTask(User owner, Long taskId) {
        Task task = requireOwnedTask(owner, taskId);
        taskRepository.delete(task);
    }

    // Central check: fetch a task ONLY if it belongs to this owner.
    // If it exists but belongs to someone else, we return 404 (not 403) so we
    // don't even confirm to a caller that another user's task ID exists.
    private Task requireOwnedTask(User owner, Long taskId) {
        return taskRepository.findByIdAndOwner(taskId, owner)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
    }

    private TaskDto toDto(Task task) {
        return new TaskDto(
                task.getId(),
                task.getTitle(),
                task.isCompleted(),
                task.getPomodorosCompleted(),
                task.getTaskDate()
        );
    }
}
