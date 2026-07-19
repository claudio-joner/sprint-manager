package SprintManager.backend.service;

import SprintManager.backend.model.Task;
import SprintManager.backend.model.emums.StatusTask;
import SprintManager.backend.repository.TaskRepository;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    public TaskService(TaskRepository taskRepository){this.taskRepository = taskRepository;}

    public List<Task> getAll(){ return taskRepository.findAll();}

    public Task getById(Long id){return taskRepository.findById(id).orElse(null); }

    public Task create(Task task){
        task.setCreatedDate(LocalDate.now());
        return taskRepository.save(task);
    }

    public boolean delete(Long id){
        if(taskRepository.existsById(id)){
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Task updateStatus(Long id, StatusTask newStatus){
        Task task = taskRepository.findById(id).orElse(null);
        if(task == null) return null;

        task.setStatus(newStatus);

        if(newStatus == StatusTask.COMPLETADA){
            task.setEndDate(LocalDate.now());
        }

        return taskRepository.save(task);
    }

    public Double calculateExceededTime(Long id){
        Task task  = taskRepository.findById(id).orElse(null);
        if(task == null) return null;

        return task.getWorkedTime() - task.getEstimatedTime();
    }
}
