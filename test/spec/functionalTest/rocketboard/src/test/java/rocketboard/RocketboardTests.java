package rocketboard;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;

import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.PageFactory;

import rocketboardPages.RocketboardPage;

public class RocketboardTests {
	private WebDriver driver;
	public static String baseUrl = "http://localhost:3000/";
	public static String serviceUrl = "#2e1c5ebdf4b4cd0e4ad4ad6e83c6212aa21a1d10";
	public String repoUsed = "pixelated-user-agent";
	public String repoCreateIssue = "User Agent";
	public Boolean issueCreated;
	public Boolean issueModalOpened;
	public static String issueContent = "PageObject_Automation"+RandomStringUtils.randomAlphabetic(6);
	int[] checkValue = null;
	String selectedOption = "";
	private RocketboardPage RocketboardPage;
	private final String messageSucessRocket="Liftoff! We Have a Liftoff!";

	@Before
	public void setUp() {
		// FIREFOX WEBDRIVER
		this.driver = new FirefoxDriver();
		this.driver.manage().window().maximize();
		this.driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);		
	    RocketboardPage = PageFactory.initElements(this.driver, RocketboardPage.class);
	}

	@After
	public void tearDown() {
		driver.close();
		driver.quit();
	}
	
	@Test
	public void moveIssueInsideDone() throws Exception{
		RocketboardPage.selectRepo(repoUsed);
		RocketboardPage.createIssueGettingValue(issueContent, issueContent, repoCreateIssue);
		RocketboardPage.moveIssue(issueContent, "ready");
		RocketboardPage.moveIssue(issueContent, "development");
		RocketboardPage.moveIssue(issueContent, "quality-assurance");
		RocketboardPage.moveIssue(issueContent, "done");
		assertThat(RocketboardPage.checkIssueLaunched(messageSucessRocket), equalTo(Boolean.TRUE));
	}
	
	@Test
	public void checkQuantityIssuesAfterCreateOne() throws Exception {
		RocketboardPage.selectRepo(repoUsed);
		checkValue = RocketboardPage.createIssueGettingValue(issueContent, issueContent, repoCreateIssue);
		assertEquals(String.valueOf(checkValue[0]+1),String.valueOf(checkValue[1]));
	}
		
	@Test
	public void moveCheckingValues() throws Exception {
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
		RocketboardPage.openModelCreateIssue();
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.TRUE));

		RocketboardPage.closeButton();	
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.FALSE));
	}

	@Test
	public void openCloseCreateForm_viaXButton() throws Exception {
		RocketboardPage.openModelCreateIssue();
		assertThat(RocketboardPage.modelOpened(), equalTo(Boolean.TRUE));
		RocketboardPage.xButton();	
		assertThat(RocketboardPage.modelOpened(), equalTo(Boolean.FALSE));
	}

	@Test
	public void openCloseCreateForm_typingOutside() throws Exception {
		RocketboardPage.openModelCreateIssue();
		RocketboardPage.waitingFrameCreateIssueOpen();
		assertThat(RocketboardPage.modelOpened(), equalTo(Boolean.TRUE));
		RocketboardPage.openModelCreateIssue();	
		RocketboardPage.waitingFrameCreateIssueClose();
		assertThat(RocketboardPage.modelOpened(), equalTo(Boolean.FALSE));
	}
	
	@Test
	public void selectingRepository() throws Exception {
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