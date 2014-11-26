package rocketboard;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.*;
import org.openqa.selenium.By;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.PageFactory;

import rocketboardPages.RocketboardPage;
import rocketboard.DriverManager;

import java.net.MalformedURLException;
import java.net.URL;

public class RocketboardTests {
	private static final String String = null;
	WebDriver driver;
	public static String baseUrl = "http://localhost:3000/";
	public static String serviceUrl = "#04bfecc08c62ba6175250190270f3119d2399b01"; // KEY FROM "TESTUSERTWBR", user created to automated tests

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
	public static String messageDone="Drop here to launch";

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
		
		/* 
		 * Choose the browser, version, and platform to test with SouceLabs 
		 * 
		DesiredCapabilities caps = DesiredCapabilities.firefox();
		caps.setCapability("platform", Platform.LINUX);
		caps.setCapability("version","28");		

		driver = new RemoteWebDriver(new URL("http://[user]:[id]@ondemand.saucelabs.com:80/wd/hub"),caps);
		this.driver.get("http://localhost:3000"+serviceUrl);
		RocketboardPage = PageFactory.initElements(this.driver, RocketboardPage.class);		 
		 */
	}



	@After
	public void tearDown() {  
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
//		RocketboardPage.selectRepo(repoUsed);
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
	/** Create an issue and check if the column backlog is correctly incremented */
	public void checkColumCount() throws Exception {

		Integer valueBefore = RocketboardPage.getCount("backlog");
		RocketboardPage.createIssue(title, desc, RocketboardPage.chooseProject());
		Integer valueAfter = RocketboardPage.getCount("backlog");
		assertThat(valueAfter, equalTo(valueBefore+1));
	}

	@Test // - Test with error: String index out of range -2
	public void moveCheckingValues() throws Exception {
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

	@Test
	public void AssignMeCard() throws Exception{
		RocketboardPage.createIssue(title, desc, RocketboardPage.chooseProject());
		String idCard = RocketboardPage.getInfo(title, "id");
		RocketboardPage.assignMe(idCard);
		assertEquals((driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a[1]/img")).isDisplayed()), Boolean.TRUE);
	}
	
	@Test
	public void setLabel() throws Exception {
		RocketboardPage.createIssueGettingValue(title, desc, repoCreateIssue);
		String href = RocketboardPage.getInfo(title, "href");
		String id = RocketboardPage.getInfo(title, "id");
		RocketboardPage.restRequest(href, "[\"bug\"]");
		RocketboardPage.visible(id);
		String label = driver.findElement(By.xpath("//*[@id='"+id+"']/div[3]/span")).getText();
		assertEquals(label.equals("bug"), Boolean.TRUE);
	}

}