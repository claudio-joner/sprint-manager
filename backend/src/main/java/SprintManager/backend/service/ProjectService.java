package SprintManager.backend.service;

import SprintManager.backend.model.Project;
import SprintManager.backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository){
        this.projectRepository = projectRepository;
    }

    public List<Project> getAll(){
        return projectRepository.findAll();
    }

    public Project getById(Long id){
        return projectRepository.findById(id).orElse(null);
    }

    public Project create(Project project){
        return projectRepository.save(project);
    }

    public boolean delete(Long id){
        if(projectRepository.existsById(id)){
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Project closeProjecte(Long id){
        Project project = projectRepository.findById(id).orElse(null);
        if(project == null)return null;

        project.setRealEndDate(LocalDate.now());
        return projectRepository.save(project);
    }



    /*
    -------------SIN REPOSITORI------------------------
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
    */
}
