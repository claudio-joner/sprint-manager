package SprintManager.backend.service;

import SprintManager.backend.model.Task;
import SprintManager.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    public TaskService(TaskRepository taskRepository){this.taskRepository = taskRepository;}

    public List<Task> getAll(){ return taskRepository.findAll();}
    public Task getById(Long id){return taskRepository.findById(id).orElse(null); }
    public Task create(Task task){return taskRepository.save(task);}
    public boolean delete(Long id){
        if(taskRepository.existsById(id)){
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
