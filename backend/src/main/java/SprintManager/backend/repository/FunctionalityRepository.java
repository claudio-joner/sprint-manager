package SprintManager.backend.repository;

import SprintManager.backend.model.Functionality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FunctionalityRepository extends JpaRepository<Functionality,Long> {
}
