package rocketboard;


import static org.hamcrest.Matchers.greaterThan;
import static org.junit.Assert.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.RandomUtils;
import org.junit.After;
import org.junit.Before;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;

import redis.clients.jedis.Jedis;
import rocketboardPages.GithubCredentials;
import rocketboardPages.RocketboardPage;
import tablero.Repository;

public abstract class AbstractRocketboardTests {

    WebDriver driver;
    public static String baseUrl = "http://localhost:3000/";
    public Boolean issueCreated;
    public Boolean issueModalOpened;
    public String title;
    public String desc;
    public String project;
    boolean privateRepo = true;


    int[] checkValue = null;
    String selectedOption = "";
    protected RocketboardPage rocketboardPage;
    public static String messageSucessRocket = "Liftoff! We Have a Liftoff!";
    public static String messageDone = "Drop here to launch";
    public static String messageLoading = "Please wait...";

    /**
     * DriverManager instance
     */
    private DriverManager managerDriver = new DriverManager();

    @Before
    public void loadDriver() throws Exception {
        title = "title_" + RandomStringUtils.randomAlphabetic(6);
        desc = "desc_" + RandomStringUtils.randomAlphabetic(6);

        managerDriver.loadDriver();
        this.driver = managerDriver.getDriver();
        rocketboardPage = new RocketboardPage(this.driver, "http://localhost:3000/");
        PageFactory.initElements(this.driver, (Object) rocketboardPage);
        Jedis client = new Jedis("localhost");
        client.connect();
        client.del("columns");
        client.hset("columns", "Ready", "0");
        client.hset("columns", "Development", "1");
        client.hset("columns", "Quality Assurance", "2");
        client.disconnect();
    }

    @Before
    public void accessRepo() throws Exception {
        boolean privateRepo = true;
        GithubCredentials credentials = getGithubCredentials();
        List<Repository> repos = getRepos();
        assertThat("there isnt any configured repos ", repos.size(), greaterThan(0));

        rocketboardPage.accessRepo(privateRepo, credentials.getUserName(), credentials.getPassword());
        rocketboardPage.waitingLoading();
    }

    @After
    public void tearDown() {
        driver.quit();
    }

    protected GithubCredentials getGithubCredentials() {
        return new GithubCredentials(getEnv("TABLERO_TEST_USER"), getEnv("TABLERO_TEST_PASS"));
    }

    protected static String getEnv(String key) {
        String value = System.getenv(key);

        if (value == null) {
            throw new IllegalStateException(String.format("Could not find environment variable value: %s", key));
        }

        return value;
    }

    protected Repository getRandomProject(){
        List<Repository> repos = getRepos();
        return repos.get(RandomUtils.nextInt(0,repos.size()-1));
    }

    protected List<Repository> getRepos(){
        ArrayList<Repository> repos = new ArrayList<Repository>();
        String reposFull = getEnv("REPOS");
        if(!reposFull.isEmpty()) {
            String[] chunks = reposFull.split(";");
            for (String chunk : chunks){
                String name = chunk,
                        key = name.toLowerCase().replace('/', '_');

                String gitHubApiPrefix = "https://api.github.com/repos/";
                repos.add(new Repository(gitHubApiPrefix + name,name,key));
            };
        }
        return repos;

    }



}
