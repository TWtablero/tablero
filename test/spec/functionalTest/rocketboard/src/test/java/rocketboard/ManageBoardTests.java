package rocketboard;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;

import rocketboardPages.RocketboardPage;


public class ManageBoardTests {
	WebDriver driver;
	public static String baseUrl = "http://localhost:3000/";
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

		title = "title_"+RandomStringUtils.randomAlphabetic(6);
		desc = "desc_"+RandomStringUtils.randomAlphabetic(6);
	}

	
	@Test
	public void selectingRepository() throws Exception {
		
		managerDriver.loadDriver();
		this.driver = managerDriver.getDriver();
		RocketboardPage = new RocketboardPage(this.driver,"http://localhost:3000/");
		PageFactory.initElements(this.driver,(Object) RocketboardPage);
		
		boolean privateRepo = true;
		RocketboardPage.accessRepo(privateRepo);
		RocketboardPage.waitingLoading();

		
		String [] dispatcher = {"dispatcher"};
		String [] platform = {"platform"};
		String [] userAgent = {"userAgent"};
		String [] projectIssue = {"projectIssue"};
		String [] pages = {"pages"};
		String [] all = {"all"};

		RocketboardPage.waitingLoading();
		RocketboardPage.uncheckAllRepo(privateRepo);
		
		RocketboardPage.clickRepo(dispatcher);
		assertThat(RocketboardPage.IsRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		RocketboardPage.clickRepo(dispatcher);

		RocketboardPage.clickRepo(platform);
		assertThat(RocketboardPage.IsRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		RocketboardPage.clickRepo(platform);

		RocketboardPage.clickRepo(userAgent);
		assertThat(RocketboardPage.IsRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
		RocketboardPage.clickRepo(userAgent);
		
		try {
			   driver.findElement(By.id("repository-4"));
			   RocketboardPage.clickRepo(projectIssue);
			   assertThat(RocketboardPage.IsRepoSelected(projectIssue[0]), equalTo(Boolean.TRUE));
			   RocketboardPage.clickRepo(projectIssue);
			     
			} 
		catch (NoSuchElementException e) { }
		
		RocketboardPage.clickRepo(pages);
		assertThat(RocketboardPage.IsRepoSelected(pages[0]), equalTo(Boolean.TRUE));
		RocketboardPage.clickRepo(pages);

		RocketboardPage.clickRepo(all);
		assertThat(RocketboardPage.IsRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.IsRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.IsRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.IsRepoSelected(pages[0]), equalTo(Boolean.TRUE));
		try {
			   driver.findElement(By.id("repository-4"));
			   assertThat(RocketboardPage.IsRepoSelected(projectIssue[0]), equalTo(Boolean.TRUE));			     
			} 
		catch (NoSuchElementException e) { }
		
		driver.quit();
	}
	
	@Test
	public void selectingRepositoryWithoutPrivate() throws Exception {
		
		managerDriver.loadDriver();
		this.driver = managerDriver.getDriver();
		RocketboardPage = new RocketboardPage(this.driver,"http://localhost:3000/");
		PageFactory.initElements(this.driver,(Object) RocketboardPage);
		
		boolean privateRepo = false;
		RocketboardPage.accessRepo(privateRepo);
		RocketboardPage.waitingLoading();

		String [] dispatcher = {"dispatcher"};
		String [] platform = {"platform"};
		String [] userAgent = {"userAgent"};
		String [] pages = {"pages"};
		String [] all = {"all"};

		RocketboardPage.waitingLoading();
		assertThat(RocketboardPage.isPrivatePresent(), equalTo(Boolean.FALSE));
		
		
		RocketboardPage.uncheckAllRepo(privateRepo);
		
		RocketboardPage.clickRepo(dispatcher);
		assertThat(RocketboardPage.IsRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		RocketboardPage.clickRepo(dispatcher);

		RocketboardPage.clickRepo(platform);
		assertThat(RocketboardPage.IsRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		RocketboardPage.clickRepo(platform);

		RocketboardPage.clickRepo(userAgent);
		assertThat(RocketboardPage.IsRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
		RocketboardPage.clickRepo(userAgent);
		
		RocketboardPage.clickRepo(pages);
		assertThat(RocketboardPage.IsRepoSelected(pages[0]), equalTo(Boolean.TRUE));
		RocketboardPage.clickRepo(pages);

		RocketboardPage.clickRepo(all);
		assertThat(RocketboardPage.IsRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.IsRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.IsRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.IsRepoSelected(pages[0]), equalTo(Boolean.TRUE));
		
		driver.quit();
	}
}