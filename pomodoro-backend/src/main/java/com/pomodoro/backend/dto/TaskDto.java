package com.pomodoro.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class TaskDto {

    private Long id;

    @NotBlank(message = "Title cannot be empty")
    private String title;

    private boolean completed;

    private int pomodorosCompleted;

    @NotNull(message = "Date is required")
    private LocalDate date;

    public TaskDto() {}

    public TaskDto(Long id, String title, boolean completed, int pomodorosCompleted, LocalDate date) {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.pomodorosCompleted = pomodorosCompleted;
        this.date = date;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public int getPomodorosCompleted() { return pomodorosCompleted; }
    public void setPomodorosCompleted(int pomodorosCompleted) { this.pomodorosCompleted = pomodorosCompleted; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}
