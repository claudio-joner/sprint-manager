package SprintManager.backend.controller;

import SprintManager.backend.model.Task;
import SprintManager.backend.service.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final  TaskService taskService;
    public TaskController (TaskService taskService){this.taskService = taskService;}

    @GetMapping
    public List<Task> getAll(){return taskService.getAll();}

    @GetMapping("/{id}")
    public Task getById(@PathVariable Long id){return taskService.getById(id);}

    @PostMapping
    public Task create(@RequestBody Task task){ return  taskService.create(task);}

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        boolean  task = taskService.delete(id);
        return task? "Task borrada.": "Task no encontrada.";
    }

}
