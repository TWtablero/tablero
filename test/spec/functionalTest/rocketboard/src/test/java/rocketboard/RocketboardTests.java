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

import com.gargoylesoftware.htmlunit.javascript.host.geo.Position;

import rocketboardPages.RocketboardPage;

public class RocketboardTests {
	private static final String String = null;
	WebDriver driver;
	public static String baseUrl = "http://localhost:3000/";
	//Change this Github token informing yours.
	public static String serviceUrl = "PUT HERE YOUR GIT TOKEN"; 
	public String repoCreateIssue = "User Agent";
	public Boolean issueCreated;
	public Boolean issueModalOpened;
	public static String title = "title_"+RandomStringUtils.randomAlphabetic(6);
	public static String desc = "desc_"+RandomStringUtils.randomAlphabetic(6);
	public String project;
	public String urlGit = "https://github.com/RocketBoard/test_issues_kanboard/issues/new";
	String[] repoUsed = {"userAgent"};


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
		//repoUsed[0]="userAgent";
	}

	@After
	public void tearDown() {
		driver.close();
		driver.quit();
	}
	
	@Test
	public void moveIssueInsideDone() throws Exception{
		RocketboardPage.selectRepo(repoUsed);
		RocketboardPage.createIssueGettingValue(title, desc, repoCreateIssue);
		RocketboardPage.moveIssue(title, "ready");
		RocketboardPage.moveIssue(title, "development");
		RocketboardPage.moveIssue(title, "quality-assurance");
		RocketboardPage.moveIssue(title, "done");
		assertThat(RocketboardPage.checkIssueLaunched(messageSucessRocket), equalTo(Boolean.TRUE));
	}
	

	@Test
	public void checkQuantityIssuesAfterCreateOne() throws Exception {
		RocketboardPage.selectRepo(repoUsed);
		checkValue = RocketboardPage.createIssueGettingValue(title, desc, repoCreateIssue);
		assertEquals(String.valueOf(checkValue[0]+1),String.valueOf(checkValue[1]));
	}	

	@Test
	public void E2E() throws Exception {
		RocketboardPage.selectRepo(repoUsed);
		checkValue = RocketboardPage.createIssueGettingValue(title, desc, RocketboardPage.chooseProject());
		assertEquals(String.valueOf(checkValue[0]+1),String.valueOf(checkValue[1]));
		RocketboardPage.moveIssue(title, "2");
		RocketboardPage.moveIssue(title, "3");
		RocketboardPage.moveIssue(title, "4");
		RocketboardPage.moveIssue(title, "5");

		Boolean issueLaunched = RocketboardPage.checkIssueLaunched("Liftoff! We Have a Liftoff!");
		assertThat(issueLaunched, equalTo(Boolean.TRUE));
	}

	@Test
	//Create an issue and check if the column backlog is correctly incremented
	public void checkColumCount() throws Exception {
		Thread.sleep(4000);
		Integer valueBefore = RocketboardPage.getCount("backlog");
		RocketboardPage.createIssue(title, desc, RocketboardPage.chooseProject());
		Integer valueAfter = RocketboardPage.getCount("backlog");
		assertThat(valueAfter, equalTo(valueBefore+1));
	}

	//@Test - Test with error: String index out of range -2
	public void moveCheckingValues() throws Exception {
		String[] position = new String[2];
		position[0]="all";
		RocketboardPage.selectRepo(position);
		assertThat(RocketboardPage.createIssueCheckingValue(title, desc, RocketboardPage.chooseProject()), equalTo(Boolean.TRUE));
		checkValue = RocketboardPage.moveIssueGettingValue(title, "2");
		assertEquals(String.valueOf(checkValue[0]+1),String.valueOf(checkValue[1]));
		checkValue = RocketboardPage.moveIssueGettingValue(title, "3");
		assertEquals(String.valueOf(checkValue[0]+1),String.valueOf(checkValue[1]));
		checkValue = RocketboardPage.moveIssueGettingValue(title, "4");
		assertEquals(String.valueOf(checkValue[0]+1),String.valueOf(checkValue[1]));
		checkValue = RocketboardPage.moveIssueGettingValue(title, "5");
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
		
		String [] dispatcher = {"dispatcher"};
		String [] platform = {"platform"};
		String [] userAgent = {"userAgent"};
		String [] all = {"all"};

		RocketboardPage.selectRepo(dispatcher);
		assertThat(RocketboardPage.IsRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		RocketboardPage.uncheckAllRepo();

		RocketboardPage.selectRepo(platform);
		assertThat(RocketboardPage.IsRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		RocketboardPage.uncheckAllRepo();

		RocketboardPage.selectRepo(userAgent);
		assertThat(RocketboardPage.IsRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
		RocketboardPage.uncheckAllRepo();

		RocketboardPage.selectRepo(all);
		assertThat(RocketboardPage.IsRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.IsRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.IsRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
	}

	@Test
	public void createSimpleIssue() throws Exception{
		RocketboardPage.selectRepo(repoUsed);
		RocketboardPage.createIssue(title, desc, RocketboardPage.chooseProject());
		RocketboardPage.waitingLoading();
		assertThat(RocketboardPage.checkTitleFrame(title), equalTo(Boolean.TRUE));
	}

	@Test
	public void issueAdvancedOption() throws Exception{
		RocketboardPage.openModelCreateIssue();
		RocketboardPage.clickAdvanced();
		assertThat(RocketboardPage.isGithub(), equalTo(urlGit));
	}

	@Test
	public void CreateIssueNoDescription() throws Exception{
		RocketboardPage.createIssue(title,"", RocketboardPage.chooseProject());
		assertThat(RocketboardPage.checkTitleFrame(title), equalTo(Boolean.TRUE));
	}

	//@Test
	public void CreateIssueNoTitle() throws Exception{
		RocketboardPage.createIssue("",desc, RocketboardPage.chooseProject());
		//assertThat(RocketboardPage... waiting for UX definition about exceptions/messages
	}

	//@Test
	public void CreateIssueEmpty() throws Exception{
		RocketboardPage.createIssue("","", RocketboardPage.chooseProject());
		//assertThat(RocketboardPage... waiting for UX definition about exceptions/messages

	}
}