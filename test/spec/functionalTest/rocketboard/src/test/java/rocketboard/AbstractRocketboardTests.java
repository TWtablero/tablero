package rocketboard;

import jdk.nashorn.internal.runtime.regexp.joni.Regex;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.After;
import org.junit.Before;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;

import rocketboardPages.GithubCredentials;
import rocketboardPages.RocketboardPage;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public abstract class AbstractRocketboardTests {

    WebDriver driver;
    public static String baseUrl = "http://localhost:3000/";
    public String repoCreateIssue = "TWtablero/UserAgent_Test-2014.12";
    public Boolean issueCreated;
    public Boolean issueModalOpened;
    public final static String title = "title_" + RandomStringUtils.randomAlphabetic(6);
    public final static String desc = "desc_" + RandomStringUtils.randomAlphabetic(6);
    public String project;
    String[] repoUsed = {"userAgent"};
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
        managerDriver.loadDriver();
        this.driver = managerDriver.getDriver();
        rocketboardPage = new RocketboardPage(this.driver, "http://localhost:3000/");
        PageFactory.initElements(this.driver, (Object) rocketboardPage);
    }

    @Before
    public void accessRepo() throws Exception {
        boolean privateRepo = true;
        GithubCredentials credentials = getGithubCredentials();
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

    protected ArrayList<String> getRepos(){
        ArrayList<String> repos = new ArrayList<>();
        String reposFull = getEnv("REPOS");
        if(!reposFull.isEmpty()) {
            String[] chunks = reposFull.split(";");
            for (String chunk : chunks){

                String name = chunk.split(chunk)[2],
                        key = name.toLowerCase().replace('/', '_');

                String gitHubApiPrefix = "https://api.github.com/repos/";
                repos.add( gitHubApiPrefix + name);
            };
        }
        return repos;

    }

}
