package rocketboardPages;

import static org.junit.Assert.fail;

import org.openqa.selenium.By;
//import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import rocketboard.RocketboardTests;

public class RocketboardPage {
	private WebDriver driver;
	Boolean issueCreated;
	Integer repoId = null;
	String getColumn = "";
	int[] values = new int[2];

	//Coluna de Issues
	@FindBy(how = How.ID, using = "0-backlog")
	WebElement columnBacklog;

	@FindBy(how = How.ID, using = "issueTitle")
	WebElement issueTitle;

	@FindBy(how = How.ID, using = "issueBody")
	WebElement issueDesc;

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

	/**
	 * input value at element IssueTitle
	 */	
	public void setIssueTitle(String value) {
		waitingObject(issueTitle);
		issueTitle.clear();
		issueTitle.click();
		issueTitle.sendKeys(value);
	}

	/**
	 * input value at element DescIssue
	 */	
	public void setIssueDesc(String value) {
		waitingObject(issueDesc);
		issueDesc.clear();
		issueDesc.click();
		issueDesc.sendKeys(value);
	}

	public void createIssue(String titleTxt, String descTxt, String repoName) throws Exception {
		waitingObject(openModalIssueBtn);
		openModalIssueBtn.click();
		setIssueTitle(titleTxt);
		setIssueDesc(descTxt);
		selectProjects(repoName);
		createBtn.click();	
		waitingLoading();
	}

	public void selectProjects(String repoName) throws Exception {
		Select selectProjects = new Select(project);
		selectProjects.selectByVisibleText(repoName);
	}

	public void selectRepo(String repoName) throws Exception {
		waitingLoading();
		WebDriverWait wait = new WebDriverWait(this.driver, 10);
		Select select=new Select(wait.until(ExpectedConditions.elementToBeClickable(filterRepo)));
		select.selectByVisibleText(repoName);
		waitingLoading();
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
		waitingLoading();
		values[0] = getCount("backlog");
		createIssue(title, desc, repoName);
		values[1] = getCount("backlog");
		return values;
	}

	public Integer getCount(String column) throws Exception {	
		waitingLoading();
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
		if(column.length()<=2){
			column=columnName(column);
		}
		WebElement d1 = driver.findElement(By.linkText(issueTitle));
		WebElement d2 = driver.findElement(By.cssSelector("div[id$='"+column+"']"));
		new Actions(driver).dragAndDrop(d1, d2).build().perform();
		waitingLoading();
	}

	public  int[] moveIssueGettingValue(String issueTitle, String column) throws Exception {
		getColumn = columnName(column);
		values[0] = getCount(getColumn);
		moveIssue(issueTitle, column);
		if (column =="5"){
			waitingLoading(); // wait for launch animation
		}
		values[1] = getCount(getColumn);
		return values;
	}

	public void waitMessage(String message) throws Exception {
		waitingLoading();
		System.out.println(message);
		int timeout=0;
		while(timeout<=10 || !message.equals(driver.findElement(By.cssSelector("div[class~='done']")).getText())){
			System.out.println(driver.findElement(By.cssSelector("div[class~='done']")).getText());
			timeout++;
		}
		System.out.println("ss");
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
		waitingLoading();
		return createBtn.isDisplayed();
	}

	public void clickOptionsLink() throws Exception {
		waitingLoading();
		options.click();
	}

	public String checkSelectedOption() throws Exception {
		Select comboBox = new Select(filterRepo);
		String selectedComboValue = comboBox.getFirstSelectedOption().getText();
		return selectedComboValue;
	}

	/**
	 * waiting load issues!
	 * @throws InterruptedException 
	 */
	public void waitingLoading() throws InterruptedException{
		int timeout=0;
		while(driver.findElement(By.id("loading")).getAttribute("class").contains("loading")||timeout==10){
			Thread.sleep(100);
			timeout++;
		}
	}

	/**
	 * waiting status element 
	 */
	public void waitingObject(WebElement object) {
		boolean regex = object.isEnabled();
		while(!regex){
			WebDriverWait wait = new WebDriverWait(this.driver, 30);
			WebElement element = wait.until(ExpectedConditions.elementToBeClickable(object));
			regex = element.isEnabled();
		}
	}
}