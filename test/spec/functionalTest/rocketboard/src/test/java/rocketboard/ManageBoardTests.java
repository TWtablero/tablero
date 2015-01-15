package rocketboard;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.*;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;

import rocketboardPages.RocketboardPage;


public class ManageBoardTests {
	WebDriver driver;
	public static String baseUrl = "http://localhost:3000/";
	public static String serviceUrl = "#6af857bcfaf0a14a2a8ee276ce6c7d4f8a994b2a"; // KEY FROM "TESTUSERTWBR", user created to automated tests

	public String repoCreateIssue = "User Agent";
	public Boolean issueCreated;
	public Boolean issueModalOpened;
	public static String title;
	public static String desc;
	public String project;
	String[] repoUsed = {"userAgent"};

	int[] checkValue = null;
	String selectedOption = "";
	private RocketboardPage rocketboardPage;
	public static String messageSucessRocket="Liftoff! We Have a Liftoff!";
	public static String messageDone="Drop here to launch";
	public static String messageLoading="Please wait...";

	/**
	 * DriverManager instance
	 */
	DriverManager managerDriver = new DriverManager();


	@Before
	public void setUp() throws Exception {
		managerDriver.loadDriver();
		this.driver = managerDriver.getDriver();
		this.driver.get("http://localhost:3000"+ serviceUrl);
		rocketboardPage = PageFactory.initElements(this.driver, RocketboardPage.class);

		title = "title_"+RandomStringUtils.randomAlphabetic(6);
		desc = "desc_"+RandomStringUtils.randomAlphabetic(6);
	}

	@After
	public void tearDown() {  
		driver.quit();
	}	

	
	@Test
	public void selectingRepository() throws Exception {
		String [] dispatcher = {"dispatcher"};
		String [] platform = {"platform"};
		String [] userAgent = {"userAgent"};
		String [] projectIssue = {"projectIssue"};
		String [] pages = {"pages"};
		String [] all = {"all"};

		rocketboardPage.waitingLoading();
		rocketboardPage.uncheckAllRepo();
		
		rocketboardPage.clickRepo(dispatcher);
		assertTrue(rocketboardPage.isRepoSelected(dispatcher[0]));
		rocketboardPage.clickRepo(dispatcher);

		rocketboardPage.clickRepo(platform);
		assertTrue(rocketboardPage.isRepoSelected(platform[0]));
		rocketboardPage.clickRepo(platform);

		rocketboardPage.clickRepo(userAgent);
		assertTrue(rocketboardPage.isRepoSelected(userAgent[0]));
		rocketboardPage.clickRepo(userAgent);
		
		rocketboardPage.clickRepo(projectIssue);
		assertTrue(rocketboardPage.isRepoSelected(projectIssue[0]));
		rocketboardPage.clickRepo(projectIssue);
		
		rocketboardPage.clickRepo(pages);
		assertTrue(rocketboardPage.isRepoSelected(pages[0]));
		rocketboardPage.clickRepo(pages);

		rocketboardPage.clickRepo(all);
		assertTrue(rocketboardPage.isRepoSelected(dispatcher[0]));
		assertTrue(rocketboardPage.isRepoSelected(platform[0]));
		assertTrue(rocketboardPage.isRepoSelected(userAgent[0]));
		assertTrue(rocketboardPage.isRepoSelected(projectIssue[0]));
		assertTrue(rocketboardPage.isRepoSelected(pages[0]));
	}

	@Test
	public void toggleBacklog() throws Exception {
		rocketboardPage.waitingLoading();

		Integer backlogCount = rocketboardPage.getCount("backlog");
		rocketboardPage.hideBacklog();

		assertFalse(rocketboardPage.getColumn("backlog").isDisplayed());
		assertThat(rocketboardPage.getSidebarCount("backlog"), is(backlogCount));

		rocketboardPage.showBacklog();
		assertTrue(rocketboardPage.getColumn("backlog").isDisplayed());
		assertThat(rocketboardPage.getCount("backlog"), is(backlogCount));
	}
}
