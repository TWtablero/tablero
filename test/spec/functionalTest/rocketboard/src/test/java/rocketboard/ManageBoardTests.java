package rocketboard;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.*;
import org.openqa.selenium.By;
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
	private RocketboardPage RocketboardPage;
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
		RocketboardPage = PageFactory.initElements(this.driver, RocketboardPage.class);	 

		
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

		RocketboardPage.waitingLoading();
		RocketboardPage.uncheckAllRepo();
		
		RocketboardPage.clickRepo(dispatcher);
		assertThat(RocketboardPage.IsRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		RocketboardPage.clickRepo(dispatcher);

		RocketboardPage.clickRepo(platform);
		assertThat(RocketboardPage.IsRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		RocketboardPage.clickRepo(platform);

		RocketboardPage.clickRepo(userAgent);
		assertThat(RocketboardPage.IsRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
		RocketboardPage.clickRepo(userAgent);
		
		RocketboardPage.clickRepo(projectIssue);
		assertThat(RocketboardPage.IsRepoSelected(projectIssue[0]), equalTo(Boolean.TRUE));
		RocketboardPage.clickRepo(projectIssue);
		
		RocketboardPage.clickRepo(pages);
		assertThat(RocketboardPage.IsRepoSelected(pages[0]), equalTo(Boolean.TRUE));
		RocketboardPage.clickRepo(pages);

		RocketboardPage.clickRepo(all);
		assertThat(RocketboardPage.IsRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.IsRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.IsRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.IsRepoSelected(projectIssue[0]), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.IsRepoSelected(pages[0]), equalTo(Boolean.TRUE));
	}
}