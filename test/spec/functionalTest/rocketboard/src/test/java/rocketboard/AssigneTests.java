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


public class AssigneTests {
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
	public void AssignMeCard() throws Exception{
		RocketboardPage.waitingLoading();
		RocketboardPage.createIssue(title, desc, RocketboardPage.chooseProject());
		RocketboardPage.waitCreatedIssue(title);
		String idCard = RocketboardPage.getInfo(title, "id");
		RocketboardPage.assignMe(idCard);
		assertEquals((driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a[1]/img")).isDisplayed()), Boolean.TRUE);
	}
	
	@Test
	public void UnassignLabel() throws Exception {
		RocketboardPage.waitingLoading();
		RocketboardPage.createIssue(title, desc, repoCreateIssue);
		String href = RocketboardPage.getInfo(title, "href");
		String idCard = RocketboardPage.getInfo(title, "id");
		RocketboardPage.restAssign(href, "{\"assignee\":\"lmarquezini\"}");
		RocketboardPage.visible(idCard);
		RocketboardPage.alreadyAssignee(idCard);
		String btn1 = driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/div/div[2]/div/button[1]")).getText();
		assertEquals(btn1.equals("Unassign"), Boolean.TRUE);
		String btn2 = driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/div/div[2]/div/button[2]")).getText();
		assertEquals(btn2.equals("Cancel"), Boolean.TRUE);
	}
	
	@Test
	public void CancelUnassignAction() throws Exception {
		RocketboardPage.waitingLoading();
		RocketboardPage.createIssue(title, desc, repoCreateIssue);
		String href = RocketboardPage.getInfo(title, "href");
		String idCard = RocketboardPage.getInfo(title, "id");
		RocketboardPage.restAssign(href, "{\"assignee\":\"lmarquezini\"}");
		RocketboardPage.visible(idCard);
		RocketboardPage.alreadyAssignee(idCard);
		RocketboardPage.unassignCancel(idCard);
		assertEquals((driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a[1]/img")).isDisplayed()), Boolean.TRUE);
	}
	
	@Test
	public void ConfirmUnassignAction() throws Exception {
		RocketboardPage.waitingLoading();
		RocketboardPage.createIssue(title, desc, repoCreateIssue);
		String href = RocketboardPage.getInfo(title, "href");
		String idCard = RocketboardPage.getInfo(title, "id");
		RocketboardPage.restAssign(href, "{\"assignee\":\"lmarquezini\"}");
		RocketboardPage.visible(idCard);
		RocketboardPage.alreadyAssignee(idCard);
		RocketboardPage.unassignConfirm(idCard);
		assertEquals((driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a[1]/img")).isDisplayed()), Boolean.FALSE);
	}
	
	@Test
	public void UnassignOwnUser() throws Exception{
		RocketboardPage.waitingLoading();
		RocketboardPage.createIssue(title, desc, RocketboardPage.chooseProject());
		RocketboardPage.waitCreatedIssue(title);
		String idCard = RocketboardPage.getInfo(title, "id");
		RocketboardPage.assignMe(idCard);
		RocketboardPage.unassignMe(idCard);
		assertEquals((driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a[1]/img")).isDisplayed()), Boolean.FALSE);
	}
	
	
	
//last  :)	
}
	
	