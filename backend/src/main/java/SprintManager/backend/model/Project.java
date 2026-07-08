package SprintManager.backend.model;

public class Project {
    private Long id;
    private String name;
    private String client;

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
}
