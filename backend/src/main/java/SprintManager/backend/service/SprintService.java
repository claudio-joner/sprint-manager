package SprintManager.backend.service;

import SprintManager.backend.model.Sprint;
import SprintManager.backend.repository.SprintRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SprintService {
    private final SprintRepository sprintRepository;

    public SprintService(SprintRepository sprintRepository){ this.sprintRepository = sprintRepository;}

    public List<Sprint> getAll(){return sprintRepository.findAll();}

    public Sprint getById(Long id){ return sprintRepository.findById(id).orElse(null);}

    public Sprint create(Sprint sprint){ return sprintRepository.save(sprint);}

    public boolean deleted(Long id){
        if(sprintRepository.existsById(id)){
            sprintRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
