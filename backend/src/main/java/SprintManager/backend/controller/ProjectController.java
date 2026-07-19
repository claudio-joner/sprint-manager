package SprintManager.backend.controller;

import SprintManager.backend.model.Project;
import SprintManager.backend.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController (ProjectService projectService){
        this.projectService = projectService;
    }

    @GetMapping
    public List<Project> getAll(){
        return  projectService.getAll();
    }

    @GetMapping("/{id}")
    public Project getById(@PathVariable Long id){
        return projectService.getById(id);
    }

    @PostMapping
    public Project create(@RequestBody Project project){
        return projectService.create(project);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
      boolean deleted = projectService.delete(id);
      return deleted ? "Proyecto eliminado" : "Proyecto no encontrado";
    }

    @PatchMapping("/{id}/close")
    public Project closeProject(@PathVariable Long id){
        return projectService.closeProject(id);
    }





}
