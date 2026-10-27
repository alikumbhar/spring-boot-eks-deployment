package com.portfolio.platform.task;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository repository;

    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Task> list() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Task get(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task create(@Valid @RequestBody CreateTaskRequest request) {
        return repository.save(new Task(request.title(), request.description()));
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @Valid @RequestBody CreateTaskRequest request) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        task.setTitle(request.title());
        task.setDescription(request.description());
        return repository.save(task);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new TaskNotFoundException(id);
        }
        repository.deleteById(id);
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    static class TaskNotFoundException extends RuntimeException {
        TaskNotFoundException(Long id) {
            super("Task not found: " + id);
        }
    }
}
