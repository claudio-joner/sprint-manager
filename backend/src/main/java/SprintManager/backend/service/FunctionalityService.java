package SprintManager.backend.service;

import SprintManager.backend.model.Functionality;
import SprintManager.backend.repository.FunctionalityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FunctionalityService {
    private final FunctionalityRepository functionalityRepository;

    public FunctionalityService (FunctionalityRepository functionalityRepository){
        this.functionalityRepository = functionalityRepository;
    }

    public List<Functionality> getAll(){ return  functionalityRepository.findAll();}
    public Functionality getById(Long id){return functionalityRepository.findById(id).orElse(null);}
    public Functionality create(Functionality functionality){return functionalityRepository.save(functionality);}
    public boolean delete(Long id){
        if(functionalityRepository.existsById(id)){
            functionalityRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
