package SprintManager.backend.controller;

import SprintManager.backend.model.Sprint;
import SprintManager.backend.service.SprintService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sprints")
public class SprintController {
    private final SprintService sprintService;
    public SprintController(SprintService sprintService){this.sprintService = sprintService; }

    @GetMapping
    public List<Sprint> getAll(){return sprintService.getAll();}

    @GetMapping("/{id}")
    public Sprint getById(@PathVariable Long id){ return sprintService.getById(id);}

    @PostMapping
    public Sprint create(@RequestBody Sprint sprint){ return  sprintService.create(sprint);}

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        boolean sprint = sprintService.delete(id);
        return sprint? "Sprint borrado":"Sprint no encontrada";
    }

}
