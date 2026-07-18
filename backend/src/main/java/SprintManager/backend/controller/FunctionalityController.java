package SprintManager.backend.controller;

import SprintManager.backend.model.Functionality;
import SprintManager.backend.service.FunctionalityService;
import SprintManager.backend.service.MemberService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/functionalities")
public class FunctionalityController {
    private final FunctionalityService functionalityService;

    public  FunctionalityController(FunctionalityService functionalityService){
        this.functionalityService = functionalityService;
    }

    @GetMapping
    public List<Functionality> getAll(){return functionalityService.getAll();}

    @GetMapping("/{id}")
    public Functionality getById(@PathVariable Long id){return functionalityService.getById(id);}

    @PostMapping
    public Functionality create(@RequestBody Functionality functionality){
       return functionalityService.create(functionality);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        boolean functionality = functionalityService.delete(id);
        return functionality? "Funcionalidad borrada":"Funcionalidad no encontrada";
    }
}
