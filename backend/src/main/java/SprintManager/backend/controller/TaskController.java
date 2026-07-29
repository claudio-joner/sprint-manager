package SprintManager.backend.controller;

import SprintManager.backend.model.Task;
import SprintManager.backend.model.emums.StatusTask;
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

    @PostMapping(consumes = "application/json")
    public Task create(@RequestBody Task task){ return  taskService.create(task);}

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        boolean  task = taskService.delete(id);
        return task? "Task borrada.": "Task no encontrada.";
    }

    @PatchMapping("/{id}/status")
    public Task updateStatus(@PathVariable Long id, @RequestBody StatusTask newStatus){
        return taskService.updateStatus(id,newStatus);
    }

    @GetMapping("/{id}/exceeded-time")
    public Double calculateExceededTime(@PathVariable Long id){
        return taskService.calculateExceededTime(id);
    }

}
