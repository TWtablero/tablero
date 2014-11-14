package rocketboardPages;

import static org.junit.Assert.fail;

import java.awt.List;
import java.util.ArrayList;

import org.apache.commons.lang3.RandomUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.By.ById;
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

	@FindBy(css="div#myModal > div")
	WebElement outsideModal;

	@FindBy(css="header > span:nth-of-type(1) > label > i")
	WebElement userAgent;

	@FindBy(css="header > span:nth-of-type(2) > label > i")
	WebElement platform;

	@FindBy(css="header > span:nth-of-type(3) > label > i")
	WebElement dispatcher;

	@FindBy(linkText="Advanced options")
	WebElement advancedOptions;

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

	public void selectRepo(String[] repoUsed) throws Exception {
		if (repoUsed[0].contains("all")){
			checkRepositoryPosition(dispatcher);
			checkRepositoryPosition(userAgent);
			checkRepositoryPosition(platform);

		}else {
			waitingLoading();
			uncheckAllRepo();
			for (int i=0;i<repoUsed.length;i++){
				if (repoUsed[i].contains("dispatcher")){
					checkRepositoryPosition(dispatcher);
				}
				if (repoUsed[i].contains("userAgent")){
					checkRepositoryPosition(userAgent);
				}
				if (repoUsed[i].contains("platform")){
					checkRepositoryPosition(platform);
				}
			}
		}
	}

	public void checkRepositoryPosition(WebElement object) throws InterruptedException{
		if (!object.isSelected()){
			object.click();
		} 
	}

	public void uncheckRepositoryPosition(WebElement object) throws InterruptedException{
		if (object.isEnabled()){
			object.click();
		} 
	}

	public void uncheckAllRepo() throws InterruptedException{
		uncheckRepositoryPosition(dispatcher);
		uncheckRepositoryPosition(userAgent);	
		uncheckRepositoryPosition(platform);	
	} 


	public boolean IsRepoSelected(String repo) throws InterruptedException{
		boolean retorno = false;		
		
		if (repo == "dispatcher")
		{
			if (driver.findElement(By.id("repository-3")).isSelected())
			retorno = true; 
			else retorno = false;
		}
		
		else if (repo == "platform")
		{
			if (driver.findElement(By.id("repository-2")).isSelected())
			retorno = true;
			else retorno = false;	
		}
		
		else if (repo == "userAgent")
		{
			if (driver.findElement(By.id("repository-1")).isSelected())
			retorno = true;
			else retorno = false;	
		}
		
		return retorno;
	}	

	public Boolean createIssueCheckingValue(String title, String desc, String repoName) throws Exception {
		Thread.sleep(5000);
		Integer valueBefore = getCount("backlog");
		createIssue(title, desc, repoName);
		Thread.sleep(5000);
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

	public void OpenModal() throws Exception {
		openModalIssueBtn.click();
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
		Thread.sleep(1000);
		return createBtn.isDisplayed();

	}

	public void clickOptionsLink() throws Exception {
		waitingLoading();
		options.click();
	}

	public String isGithub() throws Exception{
		String result = advancedOptions.getAttribute("href");
		return result;
	}

	public void clickAdvanced() throws Exception{
		advancedOptions.click();

	}

	public String chooseProject () throws Exception {
		String [] listProjects = new String[3];
		listProjects[0] = "User Agent";
		listProjects[1] = "Dispatcher";
		listProjects[2] = "Platform";
		int index = RandomUtils.nextInt(0, 2);
		return (listProjects[index]);

	}

	public boolean checkTitleFrame(String title) {
		return	driver.findElement(By.linkText(title)).isDisplayed();

	}


	public void createIssueTitle(String titleTxt) throws Exception {
		openModalIssueBtn.click();
		setIssueTitle(titleTxt);
		createBtn.click();
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

	// GET ID
	//	public void getId() throws Exception {
	//		System.out.println("HERE1!!!!");
	//WORKING FIRST POSITION		String id=driver.findElement(By.xpath("//*[@class='issue list-group-item test_issues_kanboard']")).getAttribute("id");
	//		String id=driver.findElement(By.xpath().getAttribute("id");
	//		System.out.println("ID FOUND WAS: "+id);
	//	}

	public WebElement toWebElement(String str) throws InterruptedException{
		WebElement weAux = null;

		if (str == "dispatcher"){
			weAux = driver.findElement(By.cssSelector("header > span:nth-of-type(3) > label > i"));
		}
		else if (str == "platform"){
			weAux = driver.findElement(By.cssSelector("header > span:nth-of-type(2) > label > i"));
		}
		else if (str == "userAgent"){
			weAux = driver.findElement(By.cssSelector("header > span:nth-of-type(1) > label > i"));
		}
		return weAux;

	}
}	
