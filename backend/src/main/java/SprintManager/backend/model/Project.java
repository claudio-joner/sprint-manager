package SprintManager.backend.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String client;

    @Column(nullable = false)
    private String leader;

    @Column(nullable = false)
    private Double totalHours;

    @Column(nullable = false)
    private Double hoursPerSprint;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate  estimatedEndDate;

    private LocalDate  realEndDate;

    @JsonManagedReference("project-members")
    @OneToMany(mappedBy = "project")
    private List<Member> members;

    @JsonManagedReference("project-sprints")
    @OneToMany(mappedBy = "project")
    private List<Sprint> sprints;

    @JsonManagedReference("project-functionalities")
    @OneToMany(mappedBy = "project")
    private List<Functionality> funcionalities;


    // Constructor vacío — JPA lo requiere obligatoriamente
    public Project() {}

    public Project(Long id, String name, String client) {
        this.id = id;
        this.name = name;
        this.client = client;
    }

    //Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getClient() {
        return client;
    }

    public void setClient(String client) {
        this.client = client;
    }

    public String getLeader() {
        return leader;
    }

    public void setLeader(String leader) {
        this.leader = leader;
    }

    public Double getTotalHours() {
        return totalHours;
    }

    public void setTotalHours(Double totalHours) {
        this.totalHours = totalHours;
    }

    public Double getHoursPerSprint() {
        return hoursPerSprint;
    }

    public void setHoursPerSprint(Double hoursPerSprint) {
        this.hoursPerSprint = hoursPerSprint;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate  getEstimatedEndDate() {
        return estimatedEndDate;
    }

    public void setEstimatedEndDate(LocalDate  estimatedEndDate) {
        this.estimatedEndDate = estimatedEndDate;
    }

    public LocalDate  getRealEndDate() {
        return realEndDate;
    }

    public void setRealEndDate(LocalDate  realEndDate) {
        this.realEndDate = realEndDate;
    }

    public List<Member> getMembers() {
        return members;
    }

    public void setMembers(List<Member> members) {
        this.members = members;
    }

    public List<Sprint> getSprints() {
        return sprints;
    }

    public void setSprints(List<Sprint> sprints) {
        this.sprints = sprints;
    }

    public List<Functionality> getFuncionalities() {
        return funcionalities;
    }

    public void setFuncionalities(List<Functionality> funcionalities) {
        this.funcionalities = funcionalities;
    }
}
