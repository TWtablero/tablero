package rocketboard;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;

import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.PageFactory;

import rocketboardPages.RocketboardPage;



public class RocketboardTests {
	WebDriver driver;
	public static String baseUrl = "http://localhost:3000/";
	public static String serviceUrl = "/#fe8c84520417ee740180f7cdcf2379d9d9f5cfcd"; //Marquezini's Key
	//public static String serviceUrl = "#53dfb99e23c5a4335db3240a380223e57d7567ba"; // Guilherme's Key
	public String repoUsed = "pixelated-user-agent";
	public String repoCreateIssue = "User Agent";
	public Boolean issueCreated;
	public Boolean issueModalOpened;
	public static String issueContent = "PageObject_"+RandomStringUtils.randomAlphabetic(6);
	int[] checkValue = null;
	String selectedOption = "";

	@Before
	public void setUp() {
		// FIREFOX WEBDRIVER
		driver = new FirefoxDriver();
		driver.manage().window().maximize();
		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
	}

	@After
	public void tearDown() {
		driver.close();
	}
	
	@Test
	public void E2E() throws Exception {
		RocketboardPage RocketboardPage = PageFactory.initElements(driver, RocketboardPage.class);

		RocketboardPage.selectRepo(repoUsed);

		checkValue = RocketboardPage.createIssueGettingValue(issueContent, issueContent, repoCreateIssue);
		assertEquals(String.valueOf(checkValue[0]+1),String.valueOf(checkValue[1]));

		RocketboardPage.moveIssue(issueContent, "2");
		RocketboardPage.moveIssue(issueContent, "3");
		RocketboardPage.moveIssue(issueContent, "4");
		RocketboardPage.moveIssue(issueContent, "5");

		Boolean issueLaunched = RocketboardPage.checkIssueLaunched("Liftoff! We Have a Liftoff!");
		assertThat(issueLaunched, equalTo(Boolean.TRUE));
	}
		
	@Test
	public void moveCheckingValues() throws Exception {
		RocketboardPage RocketboardPage = PageFactory.initElements(driver, RocketboardPage.class);

		RocketboardPage.selectRepo(repoUsed);
		
		assertThat(RocketboardPage.createIssueCheckingValue(issueContent, issueContent, repoCreateIssue), equalTo(Boolean.TRUE));

		checkValue = RocketboardPage.moveIssueGettingValue(issueContent, "2");
		assertEquals(String.valueOf(checkValue[0]+1),String.valueOf(checkValue[1]));
		checkValue = RocketboardPage.moveIssueGettingValue(issueContent, "3");
		assertEquals(String.valueOf(checkValue[0]+1),String.valueOf(checkValue[1]));
		checkValue = RocketboardPage.moveIssueGettingValue(issueContent, "4");
		assertEquals(String.valueOf(checkValue[0]+1),String.valueOf(checkValue[1]));
		checkValue = RocketboardPage.moveIssueGettingValue(issueContent, "5");
		assertEquals(String.valueOf(checkValue[0]+1),String.valueOf(checkValue[1]));
	}

	@Test
	public void openCloseCreateForm_viaCloseButton() throws Exception {
		RocketboardPage RocketboardPage = PageFactory.initElements(driver, RocketboardPage.class);

		RocketboardPage.openModel();
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.TRUE));

		RocketboardPage.closeButton();	
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.FALSE));
	}

	@Test
	public void openCloseCreateForm_viaXButton() throws Exception {
		RocketboardPage RocketboardPage = PageFactory.initElements(driver, RocketboardPage.class);

		RocketboardPage.openModel();
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.TRUE));

		RocketboardPage.xButton();	
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.FALSE));
	}

	@Test
	public void openCloseCreateForm_typingOutside() throws Exception {
		RocketboardPage RocketboardPage = PageFactory.initElements(driver, RocketboardPage.class);

		RocketboardPage.openModel();
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.TRUE));

		RocketboardPage.clicOutsideForm();	
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.FALSE));
	}
	
	@Test
	public void selectingRepository() throws Exception {
		RocketboardPage RocketboardPage = PageFactory.initElements(driver, RocketboardPage.class);

		RocketboardPage.selectRepo("pixelated-user-agent");
		selectedOption = RocketboardPage.checkSelectedOption();
		assertEquals(selectedOption, "pixelated-user-agent");
		
		RocketboardPage.selectRepo("pixelated-platform");
		selectedOption = RocketboardPage.checkSelectedOption();
		assertEquals(selectedOption, "pixelated-platform");
		
		RocketboardPage.selectRepo("pixelated-dispatcher");
		selectedOption = RocketboardPage.checkSelectedOption();
		assertEquals(selectedOption, "pixelated-dispatcher");
	}

//	@Test // NOT DONE!!!
//	public void openOptions() throws Exception {
//		RocketboardPage RocketboardPage = PageFactory.initElements(driver, RocketboardPage.class);
//
//		RocketboardPage.openModel();
//		RocketboardPage.clickOptionsLink();
//		issueModalOpened = RocketboardPage.modelOpened();
//		System.out.println(issueModalOpened);
//		//assertThat(issueModalOpened, equalTo(Boolean.FALSE));
//
//	}
	
//	@Test // NOT DONE!!!
//	public void assignMe() throws Exception {
//		RocketboardPage RocketboardPage = PageFactory.initElements(driver, RocketboardPage.class);
//		RocketboardPage.selectRepo(repoUsed);
//		//checkValue = RocketboardPage.createIssueGettingValue(issueContent, issueContent, repoCreateIssue);
//		RocketboardPage.getId();
//
//	}
}