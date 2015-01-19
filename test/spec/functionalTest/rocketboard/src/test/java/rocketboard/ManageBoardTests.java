package rocketboard;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;
import rocketboardPages.RocketboardPage;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;


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
		title = "title_"+RandomStringUtils.randomAlphabetic(6);
		desc = "desc_"+RandomStringUtils.randomAlphabetic(6);

		managerDriver.loadDriver();
		this.driver = managerDriver.getDriver();
		rocketboardPage = new RocketboardPage(this.driver,"http://localhost:3000/");
		PageFactory.initElements(this.driver,(Object) rocketboardPage);
	}

	
	@Test
	public void selectingRepository() throws Exception {
		boolean privateRepo = true;
		rocketboardPage.accessRepo(privateRepo);
		rocketboardPage.waitingLoading();

		
		String [] dispatcher = {"dispatcher"};
		String [] platform = {"platform"};
		String [] userAgent = {"userAgent"};
		String [] projectIssue = {"projectIssue"};
		String [] pages = {"pages"};
		String [] all = {"all"};

		rocketboardPage.waitingLoading();
		rocketboardPage.uncheckAllRepo(privateRepo);
		
		rocketboardPage.clickRepo(dispatcher);
		assertTrue(rocketboardPage.isRepoSelected(dispatcher[0]));
		rocketboardPage.clickRepo(dispatcher);

		rocketboardPage.clickRepo(platform);
		assertTrue(rocketboardPage.isRepoSelected(platform[0]));
		rocketboardPage.clickRepo(platform);

		rocketboardPage.clickRepo(userAgent);
		assertTrue(rocketboardPage.isRepoSelected(userAgent[0]));
		rocketboardPage.clickRepo(userAgent);
		
		try {
			   driver.findElement(By.id("repository-4"));
			   rocketboardPage.clickRepo(projectIssue);
			   assertThat(rocketboardPage.isRepoSelected(projectIssue[0]), equalTo(Boolean.TRUE));
			   rocketboardPage.clickRepo(projectIssue);
			     
			} 
		catch (NoSuchElementException e) { }
		
		rocketboardPage.clickRepo(pages);
		assertThat(rocketboardPage.isRepoSelected(pages[0]), equalTo(Boolean.TRUE));
		rocketboardPage.clickRepo(pages);

		rocketboardPage.clickRepo(all);
		assertThat(rocketboardPage.isRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		assertThat(rocketboardPage.isRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		assertThat(rocketboardPage.isRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
		assertThat(rocketboardPage.isRepoSelected(pages[0]), equalTo(Boolean.TRUE));
		try {
			   driver.findElement(By.id("repository-4"));
			   assertThat(rocketboardPage.isRepoSelected(projectIssue[0]), equalTo(Boolean.TRUE));
			} 
		catch (NoSuchElementException e) { }
		
		driver.quit();
	}
	
	@Test
	public void selectingRepositoryWithoutPrivate() throws Exception {
		boolean privateRepo = false;
		rocketboardPage.accessRepo(privateRepo);
		rocketboardPage.waitingLoading();

		String [] dispatcher = {"dispatcher"};
		String [] platform = {"platform"};
		String [] userAgent = {"userAgent"};
		String [] pages = {"pages"};
		String [] all = {"all"};

		rocketboardPage.waitingLoading();
		assertThat(rocketboardPage.isPrivatePresent(), equalTo(Boolean.FALSE));
		
		
		rocketboardPage.uncheckAllRepo(privateRepo);
		
		rocketboardPage.clickRepo(dispatcher);
		assertThat(rocketboardPage.isRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		rocketboardPage.clickRepo(dispatcher);

		rocketboardPage.clickRepo(platform);
		assertThat(rocketboardPage.isRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		rocketboardPage.clickRepo(platform);

		rocketboardPage.clickRepo(userAgent);
		assertThat(rocketboardPage.isRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
		rocketboardPage.clickRepo(userAgent);
		
		rocketboardPage.clickRepo(pages);
		assertThat(rocketboardPage.isRepoSelected(pages[0]), equalTo(Boolean.TRUE));
		rocketboardPage.clickRepo(pages);

		rocketboardPage.clickRepo(all);
		assertThat(rocketboardPage.isRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		assertThat(rocketboardPage.isRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		assertThat(rocketboardPage.isRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
		assertThat(rocketboardPage.isRepoSelected(pages[0]), equalTo(Boolean.TRUE));
		
		driver.quit();
	}

    @Test
      public void toggleBacklog() throws Exception {
		rocketboardPage.accessRepo(true);
		rocketboardPage.waitingLoading();
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
