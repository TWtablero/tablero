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


public class RocketboardTests {
	WebDriver driver;
	public static String baseUrl = "http://localhost:3000/";
	public static String serviceUrl = "#04bfecc08c62ba6175250190270f3119d2399b01"; // KEY FROM "TESTUSERTWBR", user created to automated tests

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
		
		title = "title_"+RandomStringUtils.randomAlphabetic(6);
		desc = "desc_"+RandomStringUtils.randomAlphabetic(6);
	}

	@After
	public void tearDown() {  
		driver.quit();
	}	

	@Test
	public void E2E() throws Exception {
		RocketboardPage.waitingLoading();
		checkValue = RocketboardPage.createIssueGettingValue(title, desc, RocketboardPage.chooseProject());
		RocketboardPage.waitCreatedIssue(title);
		assertEquals(Integer.valueOf(checkValue[0]+1),Integer.valueOf(checkValue[1]));
		RocketboardPage.moveIssue(title, "2");
		RocketboardPage.moveIssue(title, "3");
		RocketboardPage.moveIssue(title, "4");
		RocketboardPage.moveIssue(title, "5");
		Boolean issueLaunched = RocketboardPage.checkIssueLaunched(messageSucessRocket);
		assertThat(issueLaunched, equalTo(Boolean.TRUE));
	}

	@Test
	/** Create an issue and check if the column backlog is correctly incremented */
	public void createIssue() throws Exception {
		RocketboardPage.waitingLoading();
		Integer valueBefore = RocketboardPage.getCount("backlog");
		RocketboardPage.createIssue(title, desc, RocketboardPage.chooseProject());
		RocketboardPage.waitCreatedIssue(title);
		Integer valueAfter = RocketboardPage.getCount("backlog");
		assertThat(valueAfter, equalTo(valueBefore+1));
		assertThat(RocketboardPage.checkTitleFrame(title), equalTo(Boolean.TRUE));
		
	}

	@Test
	public void moveCheckingValues() throws Exception {
		RocketboardPage.waitingLoading();
		RocketboardPage.createIssue(title, desc, RocketboardPage.chooseProject());
		RocketboardPage.waitCreatedIssue(title);
		checkValue = RocketboardPage.moveIssueGettingValue(title, "2");
		assertEquals(Integer.valueOf(checkValue[0]+1),Integer.valueOf(checkValue[1]));
		checkValue = RocketboardPage.moveIssueGettingValue(title, "3");
		assertEquals(Integer.valueOf(checkValue[0]+1),Integer.valueOf(checkValue[1]));
		checkValue = RocketboardPage.moveIssueGettingValue(title, "4");
		assertEquals(Integer.valueOf(checkValue[0]+1),Integer.valueOf(checkValue[1]));
		checkValue = RocketboardPage.moveIssueGettingValue(title, "5");
		assertEquals(Integer.valueOf(checkValue[0]+1),Integer.valueOf(checkValue[1]));
	}

	@Test
	public void openCloseCreateForm_viaCloseButton() throws Exception {
		RocketboardPage.waitingLoading();
		RocketboardPage.openModelCreateIssue();
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.TRUE));
		RocketboardPage.closeButton();	
		issueModalOpened = RocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.FALSE));
	}

	@Test
	public void openCloseCreateForm_viaXButton() throws Exception {
		RocketboardPage.waitingLoading();
		RocketboardPage.openModelCreateIssue();
		assertThat(RocketboardPage.modelOpened(), equalTo(Boolean.TRUE));
		RocketboardPage.xButton();	
		assertThat(RocketboardPage.modelOpened(), equalTo(Boolean.FALSE));
	}

	@Test
	public void openCloseCreateForm_typingOutside() throws Exception {
		RocketboardPage.waitingLoading();
		RocketboardPage.openModelCreateIssue();
		RocketboardPage.waitingFrameCreateIssueOpen();
		assertThat(RocketboardPage.modelOpened(), equalTo(Boolean.TRUE));
		RocketboardPage.openModelCreateIssue();	
		assertThat(RocketboardPage.modelOpened(), equalTo(Boolean.FALSE));
	}

	//@Test // DEFECT #94
	public void selectingRepository() throws Exception {
		String [] dispatcher = {"dispatcher"};
		String [] platform = {"platform"};
		String [] userAgent = {"userAgent"};
		String [] projectIssue = {"projectIssue"};
		String [] all = {"all"};

		RocketboardPage.waitingLoading();
		RocketboardPage.selectRepo(dispatcher);
		assertThat(RocketboardPage.IsRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		RocketboardPage.uncheckAllRepo();

		RocketboardPage.selectRepo(platform);
		assertThat(RocketboardPage.IsRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		RocketboardPage.uncheckAllRepo();

		RocketboardPage.selectRepo(userAgent);
		assertThat(RocketboardPage.IsRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
		RocketboardPage.uncheckAllRepo();
		
		RocketboardPage.selectRepo(projectIssue);
		assertThat(RocketboardPage.IsRepoSelected(projectIssue[0]), equalTo(Boolean.TRUE));
		RocketboardPage.uncheckAllRepo();

		RocketboardPage.selectRepo(all);
		assertThat(RocketboardPage.IsRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.IsRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.IsRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.IsRepoSelected(projectIssue[0]), equalTo(Boolean.TRUE));
	}

	@Test
	public void issueAdvancedOption() throws Exception{
		RocketboardPage.waitingLoading();
		RocketboardPage.openModelCreateIssue();
		RocketboardPage.waitingFrameCreateIssueOpen();
		RocketboardPage.clickAdvanced();
		assertThat(RocketboardPage.isGithub().contains("https://github.com/"), equalTo(Boolean.TRUE));
		assertThat(RocketboardPage.isGithub().contains("issues/new"), equalTo(Boolean.TRUE));
	}

	@Test
	public void CreateIssueNoDescription() throws Exception{
		RocketboardPage.waitingLoading();
		RocketboardPage.createIssue(title,"", RocketboardPage.chooseProject());
		RocketboardPage.waitCreatedIssue(title);
		assertThat(RocketboardPage.checkTitleFrame(title), equalTo(Boolean.TRUE));
	}
 
	@Test
	public void AssignMeCard() throws Exception{
		RocketboardPage.waitingLoading();
		RocketboardPage.createIssue(title, desc, RocketboardPage.chooseProject());
		RocketboardPage.waitCreatedIssue(title);
		String idCard = RocketboardPage.getInfo(title, "id");
		RocketboardPage.assignMe(idCard);
		assertEquals((driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a[1]/img")).isDisplayed()), Boolean.TRUE);
	}
	
	@Test
	public void setLabel() throws Exception {
		RocketboardPage.waitingLoading();
		RocketboardPage.createIssue(title, desc, repoCreateIssue);
		String href = RocketboardPage.getInfo(title, "href");
		String id = RocketboardPage.getInfo(title, "id");
		RocketboardPage.restRequest(href, "[\"bug\"]");
		RocketboardPage.visible(id);
		String label = driver.findElement(By.xpath("//*[@id='"+id+"']/div[3]/span")).getText();
		assertEquals(label.equals("bug"), Boolean.TRUE);
	}

}