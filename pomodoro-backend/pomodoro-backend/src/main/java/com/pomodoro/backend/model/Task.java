package com.pomodoro.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "task", indexes = {
        @Index(name = "idx_task_user_date", columnList = "user_id, taskDate")
})
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Every task is scoped to its owner. All repository queries filter by this
    // so one user can never read or modify another user's tasks.
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(nullable = false)
    private boolean completed = false;

    @Column(nullable = false)
    private int pomodorosCompleted = 0;

    // The calendar day this task belongs to (independent of when it was created)
    @Column(nullable = false)
    private LocalDate taskDate;

    public Task() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public int getPomodorosCompleted() { return pomodorosCompleted; }
    public void setPomodorosCompleted(int pomodorosCompleted) { this.pomodorosCompleted = pomodorosCompleted; }

    public LocalDate getTaskDate() { return taskDate; }
    public void setTaskDate(LocalDate taskDate) { this.taskDate = taskDate; }
}
