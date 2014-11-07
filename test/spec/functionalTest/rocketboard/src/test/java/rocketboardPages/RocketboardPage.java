package rocketboardPages;

import static org.junit.Assert.fail;

import java.util.ArrayList;
import java.util.List;

//import javax.swing.text.html.parser.Element;


import org.openqa.selenium.By;
//import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.Select;

import rocketboard.RocketboardTests;

public class RocketboardPage {
	WebDriver driver;
	Boolean issueCreated;
	Integer repoId = null;
	String getColumn = "";
	int[] values = new int[2];

	@FindBy(id="issueTitle")
	WebElement title;

	@FindBy(id="issueBody")
	WebElement desc;

	@FindBy(id="projects")
	WebElement project;

	@FindBy(id="create_issue")
	WebElement createBtn;

	@FindBy(id="open_modal_issue")
	WebElement openModalIssueBtn;

	@FindBy(css="button.btn.btn-default")
	WebElement closeBtn;

	@FindBy(css="button.close")
	WebElement xBtn;

	@FindBy(id="myModal")
	WebElement outsideModal;
	
	@FindBy(id="filter-repo")
	WebElement filterRepo;

	//@FindBy(linkText="https://github.com/guipdutra/test_issues_kanboard/issues/new")
	@FindBy(className="link")
	WebElement options;

	public RocketboardPage(WebDriver driver) {
		this.driver = driver;
		driver.get(RocketboardTests.baseUrl + RocketboardTests.serviceUrl);
	}

	public void createIssue(String titleTxt, String descTxt, String repoName) throws Exception {
		openModalIssueBtn.click();
		title.sendKeys(titleTxt);
		desc.sendKeys(descTxt);
		selectProjects(repoName);
		createBtn.click();	
	}

	public void selectProjects(String repoName) throws Exception {
		Select selectProjects = new Select(project);
		selectProjects.selectByVisibleText(repoName);
	}

	public void selectRepo(String repoName) throws Exception {
		Integer repoId = null;
		
		// WAIT LOAD OPTIONS
		Thread.sleep(2000);
		
		// CREATE LIST BASED IN THE WEBELEMENTS
		//Select se = new Select(driver.findElement(By.id("filter-repo")));
		Select se = new Select(filterRepo);
		List<WebElement> l = se.getOptions();

		// CREATE ARRAY WITH WEBELEMENT OPTIONS
		ArrayList<String> actual_role = new ArrayList<String>( );
		for (int a = 0; a < l.size(); a++){
			String varA = l.get(a).getAttribute("value");
			actual_role.add(varA);
		}

		// FIND INDEX BASED THE VALUE
		if(actual_role.contains(repoName)) {  
			repoId = actual_role.indexOf(repoName); 
			repoId++; // FIX THE DIFFERENCE OF INDEX
		} 
		
		// SELECT THE OPTION
		driver.findElement(By.xpath("//select[@id='filter-repo']/option["+repoId+"]")).click();
		Thread.sleep(1000);
	}

	public Boolean createIssueCheckingValue(String title, String desc, String repoName) throws Exception {
		Integer valueBefore = getCount("backlog");
		createIssue(title, desc, repoName);
		Integer valueAfter = getCount("backlog");
		if ( valueAfter == valueBefore+1 ){
			issueCreated = Boolean.TRUE;
		} else {
			issueCreated = Boolean.FALSE;
		}
		return issueCreated;
	}

	public int[] createIssueGettingValue(String title, String desc, String repoName) throws Exception {
		values[0] = getCount("backlog");
		createIssue(title, desc, repoName);
		values[1] = getCount("backlog");
		return values;
	}

	public Integer getCount(String column) throws Exception {
		Thread.sleep(2000);
		String countValueStr = "";
		if (column == "done" ){
			countValueStr = driver.findElement(By.xpath("//div[5]/div/div/span")).getText();
		} else {
			countValueStr = driver.findElement(By.cssSelector("div.panel-heading."+column+"-header > span.issues-count")).getText();
		}
		countValueStr = countValueStr.substring(1, countValueStr.length()-1);
		Integer countValueInt = new Integer (countValueStr);
		return countValueInt;
	}

	public void moveIssue(String issueTitle, String column) throws Exception {
		if ( column == "1" || column == "backlog"){
			column = "0-backlog";
		}
		else if (column == "2" || column == "ready"){
			column = "1-ready";
		}
		else if (column == "3" || column == "development"){
			column = "2-development";
		}
		else if (column == "4" || column == "quality-assurance"){
			column = "3-quality-assurance";
		}
		else if (column == "5" || column == "done"){
			column = "4-done";
		}

		WebElement d1 = driver.findElement(By.linkText(issueTitle));
		WebElement d2 = driver.findElement(By.id(column));
		new Actions(driver).dragAndDrop(d1, d2).build().perform();
		Thread.sleep(1000);
	}

	public  int[] moveIssueGettingValue(String issueTitle, String column) throws Exception {
		getColumn = columnName(column);
		values[0] = getCount(getColumn);
		moveIssue(issueTitle, column);
		if (column =="5"){
			Thread.sleep(4000); // wait for launch animation
		}
		values[1] = getCount(getColumn);
		return values;
	}

	public void waitMessage(String message) throws Exception {
		for (int second = 0;; second++) {
			if (second >= 60) fail("timeout");
			try { if (message.equals(driver.findElement(By.xpath("//div[5]/div/div/h3")).getText())) break; } catch (Exception e) {}
			Thread.sleep(1000);
		}
	}

	public String columnName (String column) {
		if ( column == "1"){
			column = "backlog";
		}
		else if (column == "2"){
			column = "ready";
		}
		else if (column == "3"){
			column = "development";
		}
		else if (column == "4"){
			column = "quality-assurance";
		}
		else if (column == "5"){
			column = "done";
		}
		return column;
	}

	public void openModel() throws Exception {
		openModalIssueBtn.click();
	}

	public void closeButton() throws Exception {
		closeBtn.click();
	}

	public void xButton() throws Exception {
		xBtn.click();
	}

	public void clicOutsideForm() throws Exception {
		outsideModal.click();
	}

	public Boolean checkIssueLaunched(String message) throws Exception {
		waitMessage(message);
		return driver.getPageSource().contains(message);
	}

	public Boolean modelOpened() throws Exception {
		//return driver.getPageSource().contains(create_issue);
		Thread.sleep(1000);
		return createBtn.isDisplayed();
	}

	public void clickOptionsLink() throws Exception {
		Thread.sleep(1000);
		options.click();
	}
	
	public String checkSelectedOption() throws Exception {
		Select comboBox = new Select(filterRepo);
		String selectedComboValue = comboBox.getFirstSelectedOption().getText();
		return selectedComboValue;
	}
	
	// GET ID
//	public void getId() throws Exception {
//		System.out.println("HERE1!!!!");
//WORKING FIRST POSITION		String id=driver.findElement(By.xpath("//*[@class='issue list-group-item test_issues_kanboard']")).getAttribute("id");
//		String id=driver.findElement(By.xpath().getAttribute("id");
//		System.out.println("ID FOUND WAS: "+id);
//	}
}