package rocketboard;


import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.RandomUtils;
import org.junit.*;
import org.junit.rules.MethodRule;
import org.junit.runners.model.FrameworkMethod;
import org.junit.runners.model.Statement;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;

import rocketboardPages.GithubCredentials;
import rocketboardPages.RocketboardPage;
import tablero.Repository;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public abstract class AbstractRocketboardTests {

    static WebDriver driver;
    public static String baseUrl = "http://localhost:3000/";
    public Boolean issueCreated;
    public Boolean issueModalOpened;
    public final static String title = "title_" + RandomStringUtils.randomAlphabetic(6);
    public final static String desc = "desc_" + RandomStringUtils.randomAlphabetic(6);
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
    private static DriverManager managerDriver = new DriverManager();

    @Rule
    public ScreenshotTestRule screenshotTestRule = new ScreenshotTestRule();

    @BeforeClass
    public static void loadDriver() throws Exception{
        managerDriver.loadDriver();
        driver = managerDriver.getDriver();
    }


    @Before
    public void accessRepo() throws Exception {
        rocketboardPage = new RocketboardPage(this.driver, "http://localhost:3000/");
        PageFactory.initElements(this.driver, (Object) rocketboardPage);
        boolean privateRepo = true;
        GithubCredentials credentials = getGithubCredentials();
        List<Repository> repos = getRepos();
        org.junit.Assert.assertTrue("there isnt any configured repos ",repos.size() > 0);

        rocketboardPage.accessRepo(privateRepo, credentials.getUserName(), credentials.getPassword());
        rocketboardPage.waitingLoading();
    }

    @AfterClass
    public static void tearDown() {
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



    class ScreenshotTestRule implements MethodRule {
        public Statement apply(final Statement statement, final FrameworkMethod frameworkMethod, final Object o) {
            return new Statement() {
                @Override
                public void evaluate() throws Throwable {
                    try {
                        statement.evaluate();
                    } catch (Throwable t) {
                        captureScreenshot(frameworkMethod.getName());
                        throw t; // rethrow to allow the failure to be reported to JUnit
                    }
                }

                public void captureScreenshot(String fileName) {
                    try {
                        new File("target/surefire-reports/").mkdirs(); // Insure directory is there
                        FileOutputStream out = new FileOutputStream("target/surefire-reports/screenshot-" + fileName + ".png");
                        out.write(((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES));
                        out.close();
                    } catch (Exception e) {
                        // No need to crash the tests if the screenshot fails
                    }
                }
            };
        }
    }



}
