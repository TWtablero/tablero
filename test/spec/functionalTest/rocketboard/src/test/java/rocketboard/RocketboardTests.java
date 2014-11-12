package rocketboard;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;
import java.util.concurrent.TimeUnit;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.PageFactory;
import rocketboardPages.RocketboardPage;


public class RocketboardTests {
	private static final String String = null;
	WebDriver driver;
	public static String baseUrl = "http://localhost:3000/";
	public static String serviceUrl = "#4d310fd6a7ff10ee59f71790043d3f170ad3dc4b"; //Fabio's Key
	//public static String serviceUrl = "/#fe8c84520417ee740180f7cdcf2379d9d9f5cfcd"; //Marquezini's Key
	//public static String serviceUrl = "#53dfb99e23c5a4335db3240a380223e57d7567ba"; // Guilherme's Key
	public String repoUsed = "pixelated-user-agent";
	public String repoCreateIssue = "User Agent";
	public Boolean issueCreated;
	public Boolean issueModalOpened;
	public static String issueContent = "PageObject_Automation"+RandomStringUtils.randomAlphabetic(6);
	public String title = "title_"+RandomStringUtils.randomAlphabetic(6);
	public String desc = "desc_"+RandomStringUtils.randomAlphabetic(6);
	public String project;
	public String urlGit = "https://github.com/RocketBoard/test_issues_kanboard/issues/new";


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
	public void E2E() throws Exception {
		RocketboardPage.selectRepo(repoUsed);

		checkValue = RocketboardPage.createIssueGettingValue(issueContent, issueContent, RocketboardPage.chooseProject());
		assertEquals(String.valueOf(checkValue[0]+1),String.valueOf(checkValue[1]));

		RocketboardPage.moveIssue(issueContent, "2");
		RocketboardPage.moveIssue(issueContent, "3");
		RocketboardPage.moveIssue(issueContent, "4");
		RocketboardPage.moveIssue(issueContent, "5");

		Boolean issueLaunched = RocketboardPage.checkIssueLaunched("Liftoff! We Have a Liftoff!");
		assertThat(issueLaunched, equalTo(Boolean.TRUE));
	}

	@Test
	/*Create an issue and check if the column backlog is correctly incremented  */
	public void checkColumCount() throws Exception {
		Thread.sleep(4000);
		Integer valueBefore = RocketboardPage.getCount("backlog");
		RocketboardPage.createIssue(title, desc, RocketboardPage.chooseProject());
		Integer valueAfter = RocketboardPage.getCount("backlog");
		assertThat(valueAfter, equalTo(valueBefore+1));
	}

	@Test
	public void moveCheckingValues() throws Exception {
		RocketboardPage.selectRepo(repoUsed);

		assertThat(RocketboardPage.createIssueCheckingValue(issueContent, issueContent, RocketboardPage.chooseProject()), equalTo(Boolean.TRUE));

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
		RocketboardPage.openModel();
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.TRUE));

		RocketboardPage.closeButton();	
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.FALSE));
	}

	@Test
	public void openCloseCreateForm_viaXButton() throws Exception {
		RocketboardPage.openModel();
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.TRUE));

		RocketboardPage.xButton();	
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.FALSE));
	}

	@Test
	public void openCloseCreateForm_typingOutside() throws Exception {
		RocketboardPage.openModel();
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.TRUE));

		RocketboardPage.clicOutsideForm();	
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.FALSE));
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

		RocketboardPage.selectRepo("All repositories");
		selectedOption = RocketboardPage.checkSelectedOption();
		assertEquals(selectedOption, "All repositories");
	}

	@Test
	public void createSimpleIssue() throws Exception{
		RocketboardPage RocketboardPage = PageFactory.initElements(driver, RocketboardPage.class);
		RocketboardPage.createIssue(title, desc, RocketboardPage.chooseProject());
		assertThat(RocketboardPage.checkTitleFrame(title), equalTo(Boolean.TRUE));
	}

	@Test
	public void issueAdvancedOption() throws Exception{
		RocketboardPage RocketboardPage = PageFactory.initElements(driver, RocketboardPage.class);
		RocketboardPage.OpenModal();
		RocketboardPage.clickAdvanced();
		assertThat(RocketboardPage.isGithub(), equalTo(urlGit));
	}

	@Test
	public void CreateIssueNoDescription() throws Exception{
		RocketboardPage RocketboardPage = PageFactory.initElements(driver, RocketboardPage.class);
		RocketboardPage.createIssue(title,"", RocketboardPage.chooseProject());
		assertThat(RocketboardPage.checkTitleFrame(title), equalTo(Boolean.TRUE));
	}

	//@Test
	public void CreateIssueNoTitle() throws Exception{
		RocketboardPage RocketboardPage = PageFactory.initElements(driver, RocketboardPage.class);
		RocketboardPage.createIssue("",desc, RocketboardPage.chooseProject());
		//assertThat(RocketboardPage... waiting for UX definition about exceptions/messages
	}

	//@Test
	public void CreateIssueEmpty() throws Exception{
		RocketboardPage RocketboardPage = PageFactory.initElements(driver, RocketboardPage.class);
		RocketboardPage.createIssue("","", RocketboardPage.chooseProject());
		//assertThat(RocketboardPage... waiting for UX definition about exceptions/messages

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