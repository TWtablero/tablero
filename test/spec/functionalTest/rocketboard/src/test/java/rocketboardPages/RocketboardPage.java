package rocketboardPages;

import static org.junit.Assert.fail;







//import java.awt.List;
import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.*;
import org.apache.commons.lang3.RandomUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.By.ById;
import org.openqa.selenium.WebDriver.Options;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.*;
import org.openqa.selenium.support.ui.*;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

import rocketboard.RocketboardTests;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.WebDriver;


public class RocketboardPage {
	private WebDriver driver;
	private Boolean issueCreated;
	Integer repoId = null;
	String getColumn = "";
	int[] values = new int[2];
	Integer indexID = null;
	Integer nameID = null;
	String getInfo = "";

	//Coluna de Issues
	@FindBy(how = How.ID, using = "0-backlog")
	WebElement columnBacklog;

	@FindBy(how = How.ID, using = "issueTitle")
	WebElement editIssueTitle;

	@FindBy(how = How.ID, using = "issueBody")
	WebElement editIssueDesc;

	@FindBy(how = How.ID, using = "open_modal_issue")
	WebElement btnOpenModalCreateIssue;

	@FindBy(how = How.ID, using = "create_issue")
	WebElement btnCreateIssue;

	@FindBy(how = How.ID, using = "projects")
	WebElement comboBoxProject;

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
		super();
		this.driver = driver;
		driver.get(RocketboardTests.baseUrl + RocketboardTests.serviceUrl);

	}

	/**
	 * input value at element IssueTitle
	 * @throws InterruptedException 
	 */	
	public void setIssueTitle(String value) throws InterruptedException {
		frameCreateIssueDisplayed();
		waitingObject(editIssueTitle);
		editIssueTitle.clear();
		editIssueTitle.click();
		editIssueTitle.sendKeys(value);
	}

	/**
	 * input value at element DescIssue
	 */	
	public void setIssueDesc(String value) {
		waitingObject(editIssueDesc);
		editIssueDesc.clear();
		editIssueDesc.click();
		editIssueDesc.sendKeys(value);
	}

	/**
	 * click at element CreateIssue
	 */	
	public void openModelCreateIssue() throws Exception {
		waitingLoading();
		waitingObject(btnOpenModalCreateIssue);
		btnOpenModalCreateIssue.click();
	}

	/**
	 * click at element CreateIssue
	 */	
	public void clickbtnCreateIssue() throws Exception {
		waitingObject(btnCreateIssue);
		btnCreateIssue.click();
	}

	/**
	 * select project
	 */	
	public void selectProjects(String repoName) throws Exception {
		Select selectProjects = new Select(comboBoxProject);
		selectProjects.selectByVisibleText(repoName);
	}

	public void createIssue(String titleTxt, String descTxt, String repoName) throws Exception {
		openModelCreateIssue();
		setIssueTitle(titleTxt);
		setIssueDesc(descTxt);
		selectProjects(repoName);
		clickbtnCreateIssue();	
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
//		String id = getInfo(title, "id");
//		visible(id);
		WebDriverWait wait = new WebDriverWait(driver, 10);
		Boolean element = wait.until(
		        ExpectedConditions.textToBePresentInElement(By.cssSelector("div[id$='backlog']"), title));
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
			driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
			waitMessage(RocketboardTests.messageDone);
		}
		values[1] = getCount(getColumn);
		return values;
	}

	public void waitMessage(String message) throws Exception {
		WebDriverWait wait = new WebDriverWait(driver, 10);
		Boolean element = wait.until(
		        ExpectedConditions.textToBePresentInElement(By.cssSelector("div[class~='done']"), message));
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
		return btnCreateIssue.isDisplayed();		
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

	/**
	 * waiting load issues!
	 * @throws InterruptedException 
	 */
	//FIX ME: Retirar o threadsleep
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

	public boolean frameCreateIssueDisplayed(){
		return driver.findElement(By.cssSelector("div[class=modal-content]")).isDisplayed();
	}

	public void waitingFrameCreateIssueOpen() throws InterruptedException{
		boolean regex = frameCreateIssueDisplayed();
		int timeout=0;
		while(!regex||timeout>=30){
			WebDriverWait wait = new WebDriverWait(this.driver, 30);
			WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div[class=modal-content]")));;
			regex = element.isDisplayed();
			timeout++;
		}
	}


	public String getInfo(String nameIssue, String info) throws Exception {		
		/** Create array with WebElement options*/
		List<WebElement> l = driver.findElements(By.xpath("//div[contains(@class, 'issue list-group-item')]"));
		List<WebElement> name = driver.findElements(By.xpath("//*[@class='title list-group-item-heading']"));


		/** Create array with WebElement options - ID */
		ArrayList<String> actual_role = new ArrayList<String>( );
		for (int a = 0; a < l.size(); a++){
			String varA = l.get(a).getAttribute("id");
			actual_role.add(varA);
		}

		/** Create array with WebElement options - Value */
		ArrayList<String> actual_name = new ArrayList<String>( );
		for (int a = 0; a < name.size(); a++){
			String varB = name.get(a).getText();
			actual_name.add(varB);
		}

		/** Create array with WebElement options - Href */
		ArrayList<String> actual_href = new ArrayList<String>( );
		for (int a = 0; a < name.size(); a++){
			String varC = name.get(a).getAttribute("href");
			actual_href.add(varC);
		}

		/** Find index based the value */
		if(actual_name.contains(nameIssue)) {  
			nameID = actual_name.indexOf(nameIssue); 
		} 

		/**Find value/href based in the index */
		String value = actual_role.get(nameID);
		String href = actual_href.get(nameID);

		/** Check witch info should return */
		if (info =="href"){
			getInfo =  href.substring(19);
		} else if (info =="id") {
			getInfo =  value;
		}

		return getInfo.toString();
	}

	public void assignMe(String id) throws Exception {
		WebElement assign = driver.findElement(By.xpath("//*[@id='"+id+"']/div[1]/a[1]/span[2]"));
		assign.click();
		WebDriverWait wait = new WebDriverWait(driver, 10);
		WebElement element = wait.until(
		        ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='"+id+"']/div[1]/a[1]/img")));
	}

	public void pageRefresh() throws Exception {
		driver.navigate().refresh();
	}

	public void restRequest(String urlGit, String labelGit) throws Exception {	
		// SETUP STRINGS
		String urlString = "https://api.github.com/repos/"+urlGit+"/labels?access_token="+RocketboardTests.serviceUrl.substring(1);
		String infWebSvcRequestMessage = labelGit;

		// CREATE HTTP REQUEST CONTENT
		URL urlForInfWebSvc = new URL(urlString);
		URLConnection UrlConnInfWebSvc = urlForInfWebSvc.openConnection();
		HttpURLConnection httpUrlConnInfWebSvc = (HttpURLConnection) UrlConnInfWebSvc;
		httpUrlConnInfWebSvc.setDoOutput(true);
		httpUrlConnInfWebSvc.setDoInput(true);
		httpUrlConnInfWebSvc.setAllowUserInteraction(true);
		httpUrlConnInfWebSvc.setRequestMethod("POST");
		OutputStreamWriter infWebSvcReqWriter = new OutputStreamWriter(httpUrlConnInfWebSvc.getOutputStream());
		infWebSvcReqWriter.write(infWebSvcRequestMessage);
		infWebSvcReqWriter.flush();
		infWebSvcReqWriter.close();

		// get a response - maybe "success" or "true", XML or JSON etc.
		InputStream inputStream = httpUrlConnInfWebSvc.getInputStream();
		BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
		String line;
		StringBuffer response = new StringBuffer();
		while ((line = bufferedReader.readLine()) != null) {
			response.append(line);
			response.append('\r');
		}
		bufferedReader.close();
	}

	public boolean visible(String id) throws Exception {
		int i = 0;
		boolean present = false;
		while(i<=60 && present == false){
			pageRefresh();
			waitingLoading();
			try {
				driver.findElement(By.xpath("//*[@id='"+id+"']/div[1]"));
	            present = true;
	        } catch (org.openqa.selenium.NoSuchElementException e) {
	        	present = false;
	        }
			System.out.print(present);
			i++;
		}
		return present;
	}

}

