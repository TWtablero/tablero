package rocketboard;

import static org.junit.Assert.assertEquals;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;
import rocketboardPages.RocketboardPage;


public class UpdateIssueTests {
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