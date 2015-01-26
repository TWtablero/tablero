package tablero;

public class Repository {
    private String name;
    private String path;
    private String key;

    public Repository(String path, String name, String key) {
        this.path = path;
        this.name = name;
        this.key = key;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}
