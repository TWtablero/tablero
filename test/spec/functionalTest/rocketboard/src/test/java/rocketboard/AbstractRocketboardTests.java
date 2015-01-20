package rocketboard;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.After;
import org.junit.Before;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;

import rocketboardPages.RocketboardPage;

public abstract class AbstractRocketboardTests {
	
	WebDriver driver;
	public static String baseUrl = "http://localhost:3000/";
	public String repoCreateIssue = "User Agent";
	public Boolean issueCreated;
	public Boolean issueModalOpened;
	public final static String title = "title_"+RandomStringUtils.randomAlphabetic(6);
	public final static String desc = "desc_"+RandomStringUtils.randomAlphabetic(6);
	public String project;
	String[] repoUsed = {"userAgent"};
	boolean privateRepo = true;


	int[] checkValue = null;
	String selectedOption = "";
	protected RocketboardPage rocketboardPage;
	public static String messageSucessRocket="Liftoff! We Have a Liftoff!";
	public static String messageDone="Drop here to launch";
	public static String messageLoading="Please wait...";

	/**
	 * DriverManager instance
	 */
	private DriverManager managerDriver = new DriverManager();

	@Before
	public void loadDriver() throws Exception {
		managerDriver.loadDriver();
		this.driver = managerDriver.getDriver();
		rocketboardPage = new RocketboardPage(this.driver,"http://localhost:3000/");
		PageFactory.initElements(this.driver,(Object) rocketboardPage);
	}

	@Before
	public void accessRepo() throws Exception {
		boolean privateRepo = true;
		rocketboardPage.accessRepo(privateRepo);
		rocketboardPage.waitingLoading();
	}
	
	@After
	public void tearDown() {  
		driver.quit();
	}	

}
