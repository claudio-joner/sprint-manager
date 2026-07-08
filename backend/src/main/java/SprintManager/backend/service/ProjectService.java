package SprintManager.backend.service;

import SprintManager.backend.model.Project;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {
    private List<Project> projects = new ArrayList<>();
    private Long nextId = 1L;


    public Project create(Project p){
        p.setId(nextId++);
        projects.add(p);
        return p;
    }

    public List<Project> getAll(){
        return projects;
    }

    public Project getById(Long id){
        return projects.stream().filter(p -> p.getId().equals(id) ).findFirst().orElse(null);
    }

    public boolean delete(Long id){
        return projects.removeIf(p -> p.getId().equals(id));
    }

}
