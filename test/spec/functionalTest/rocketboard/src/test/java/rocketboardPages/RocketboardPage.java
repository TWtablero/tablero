package rocketboardPages;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import rocketboardPages.GitHub.AuthorizePage;
import rocketboardPages.GitHub.AuthenticatePage;

import java.util.concurrent.TimeUnit;

public class RocketboardPage {

	private String messageSucessRocket = "Liftoff! We Have a Liftoff!";
	private String messageDone = "Drop here to launch";
	private String messageLoading = "Please wait...";

	private WebDriver driver;
	Integer repoId = null;
	int[] values = new int[2];
	Integer indexID = null;
	Integer nameID = null;
	String getInfo = "";

	@FindBy(how = How.ID, using = "0-backlog")
	WebElement backlogColumn;

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

	@FindBy(css = "header > div > span > label > i")
	List<WebElement> repoFilters;

	@FindBy(linkText="Advanced options")
	WebElement advancedOptions;

	@FindBy(className="link")
	WebElement options;
	
	@FindBy(id = "showPublicBtn")
	WebElement btPublicRepo;
	
	@FindBy(id = "showPublicAndPrivateBtn")
	WebElement btAllRepo;

	@FindBy(id = "changeAccess")
	WebElement btChangeAccess;

	@FindBy(id = "changeColumns")
	WebElement changeColumnsButton;

	@FindBy(id = "addColumn")
	WebElement addNewColumnLink;

	@FindBy(id = "saveColumnsChanges")
	WebElement saveColumnsButton;

	public RocketboardPage(WebDriver driver , String baseUrl) {
		super();
		this.driver = driver;
		driver.get(baseUrl);

	}

	/**
	 * input value at element IssueTitle
	 * @throws InterruptedException 
	 */	
	public void setIssueTitle(String value) throws InterruptedException {
		frameCreateIssueDisplayed();
		waitingObject(editIssueTitle);
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
		waitingObject(btnOpenModalCreateIssue);
		btnOpenModalCreateIssue.click();
	}

	/**
	 * click at element CHANGE ACCESS
	 */
	public void openChangeAccess() throws InterruptedException {
		waitingObject(btChangeAccess);
		btChangeAccess.click();
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
		waitCreatedIssue(titleTxt);
	}

	public void clickRepo(String repoKey) throws Exception {
		waitingLoading();
		WebElement element = driver.findElement(By.cssSelector("input[repo='"+repoKey+"'] + label > i"));
		if (element != null) {
			checkRepositoryPosition(element);
		} else {
			throw new IllegalArgumentException("cant find the repository");
		}
	}

	public boolean isPrivatePresent () {
		boolean privatePresent = true;		

		try { 
			driver.findElement(By.id("repository-4"));
			privatePresent = true;
		} catch (org.openqa.selenium.NoSuchElementException e) {
			privatePresent = false;
		}
		return privatePresent;
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

	public void uncheckAllRepo(boolean privateRepo) throws InterruptedException{
		for(WebElement repo : repoFilters) {
			uncheckRepositoryPosition(repo);
		}
	}


	public boolean isRepoSelected(String repoKey) throws InterruptedException{
		return driver.findElement(By.cssSelector(("input[repo='"+repoKey+"']"))).isSelected();
	}

	public int[] createIssueGettingValue(String title, String desc, String repoName) throws Exception {
		WebDriverWait wait = new WebDriverWait(this.driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div[class*='panel-heading backlog'] > span.issues-count")));
		wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector("div.blockUI.blockMsg.blockPage h1#loading.loading")));
		values[0] = getCount("backlog");
		createIssue(title, desc, repoName);
		waitCreatedIssue(title);
		values[1] = getCount("backlog");
		return values;
	}

	public Integer getCount(String column) throws Exception {
		String countValueStr = "";
		while(countValueStr == ""){
			countValueStr = driver.findElement(By.cssSelector("div[class*='panel-heading "+column+"'] > span.issues-count")).getText();
		}
		return parseCount(countValueStr);
	}

	private Integer parseCount(final String value) {
		return new Integer (value.substring(1, value.length()-1));
	}

	public void moveIssue(String issueTitle, String column) throws Exception {
		if(column.length()<=2) {
			column=columnName(column);
		}
		WebElement d1 = driver.findElement(By.linkText(issueTitle));
		WebElement d2;
		if (column == "done" || column =="5") {
			d2 = driver.findElement(By.id("4-done"));
		} else {
			d2 = driver.findElement(By.cssSelector("div[id$='"+column+"']"));
		}
		Actions builder = new Actions(driver);
		Actions dragAndDrop = builder.clickAndHold(d1).moveToElement(d2);
		dragAndDrop.build().perform();
		Thread.sleep(400);
		dragAndDrop.moveToElement(d2).build().perform();
		Thread.sleep(400);
		dragAndDrop.release(d2).build().perform();
	}

	public  int[] moveIssueGettingValue(String issueTitle, String column) throws Exception {
		int timeout = 0;
		String idCard = null;
		String getColumn = columnName(column);
		values[0] = getCount(getColumn);
		
		if (column =="5" || column =="done") {
			idCard = getInfo(issueTitle, "id");
		}
		
		moveIssue(issueTitle, column);
		if (column =="5" || column =="done") {
			boolean present = driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a")).isDisplayed();
			while(present == true && timeout <= 10){
				moveIssue(issueTitle, column);
				present = driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a")).isDisplayed();
				timeout++;
			}
			waitMessage(messageSucessRocket);
			waitMessage(messageDone);
		}
		Thread.sleep(800);
		values[1] = getCount(getColumn);
		return values;
	}

	public void waitMessage(String message) throws Exception {
		int timeout=0;
		while(driver.getPageSource().contains(message) == false && timeout != 20 ){
			Thread.sleep(500);
			timeout++;
		}
	}

	public String columnName (String column) {
		if (column == "1") {
			column = "backlog";
		} else if (column == "2") {
			column = "ready";
		} else if (column == "3") {
			column = "development";
		} else if (column == "4") {
			column = "quality-assurance";
		} else if (column == "5") {
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


	public boolean checkTitleFrame(String title) {
		return	driver.findElement(By.linkText(title)).isDisplayed();
	}

	/**
	 * waiting load issues!
	 * @throws InterruptedException 
	 */
	public void waitingLoading() throws Exception{
		Boolean present = true;
		driver.manage().timeouts().implicitlyWait(1, TimeUnit.SECONDS);

		while(present) {
			try {
				driver.findElement(By.id("loading"));
				present = true;
			} catch (org.openqa.selenium.NoSuchElementException e) {
				present = false;
			}
		};
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
			WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div[class=modal-content]")));
			regex = element.isDisplayed();
			timeout++;
		}
	}


	public String getInfo(String nameIssue, String info) throws Exception {		
		if(info.equals("id")) {
			WebElement issueText = driver.findElement(By.xpath("//a[contains(text(),'" + nameIssue +"')]"));
			WebElement issue = issueText.findElement(By.xpath("../.."));
			return issue.getAttribute("id");	
		} else {
			WebElement issueText = driver.findElement(By.xpath("//a[contains(text(),'" + nameIssue +"')]"));
			return issueText.getAttribute("href");
		}
	}

	public void assignMe(String id) throws Exception {
		WebElement assign = driver.findElement(By.xpath("//*[@id='" + id + "']/div[1]/a[1]/span[2]"));
		assign.click();
		WebDriverWait wait = new WebDriverWait(driver, 20);
		wait.until(
				ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='"+id+"']/div[1]/a[1]/img")));
	}
	
	public void unassignMe(String id) throws Exception {
		WebElement unassign = driver.findElement(By.xpath("//*[@id='" + id + "']/div[1]/a[1]/img"));
		unassign.click();
		WebDriverWait wait = new WebDriverWait(driver, 20);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='"+id+"']/div[1]/a[1]/span[2]")));
	}
	
	public void alreadyAssignee(String id) throws Exception {
		WebElement unassign = driver.findElement(By.xpath("//*[@id='"+id+"']/div[1]/a[1]/img"));
		unassign.click();
	}

	public void pageRefresh() throws Exception {
		driver.navigate().refresh();
	}

	public void restRequest(String urlGit, String labelGit) throws Exception {	
		// SETUP STRINGS
		String currentUrl = driver.getCurrentUrl();
		String token = currentUrl.substring(currentUrl.length()-40);
		String urlString = "https://api.github.com/repos/"+urlGit+"/labels?access_token="+token;
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
	
	public void restAssign(String urlGit, String labelGit) throws Exception {	
		// SETUP STRINGS
		String currentUrl = driver.getCurrentUrl();
		String token = currentUrl.substring(currentUrl.length()-40);
		String urlString = "https://api.github.com/repos/"+urlGit+"?access_token="+token;
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
			i++;
		}
		return present;
	}
	
	public boolean verifyLabel(String label) throws Exception{
		boolean verify = driver.getPageSource().contains(label);
		System.out.print("VERIFY VALUE: " + verify);
		return verify;
	}
	
	public void waitCreatedIssue(String label) throws Exception{
		WebDriverWait wait = new WebDriverWait(this.driver, 45);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.linkText(label)));
	}
	
	public void unassignCancel(String id) throws Exception {
		WebElement unassignCancelBtn = driver.findElement(By.xpath("//*[@id='"+id+"']/div[1]/div/div[2]/div/button[2]"));
		unassignCancelBtn.click();
		WebDriverWait wait = new WebDriverWait(driver, 20);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='"+id+"']/div[1]/a[1]/img")));
	}
	
	public void unassignConfirm(String id) throws Exception {
		WebElement unassignConfirmBtn = driver.findElement(By.xpath("//*[@id='" + id + "']/div[1]/div/div[2]/div/button[1]"));
		unassignConfirmBtn.click();
		WebDriverWait wait = new WebDriverWait(driver, 20);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='"+id+"']/div[1]/a[1]/span[1]")));
	}

	public void hideBacklog() throws InterruptedException {
		getColumn("backlog").
			indElement(By.cssSelector(".hide-icon")).
			click();
		Thread.sleep(2000);
	}

	public WebElement getColumn(String name) {
		return driver.findElement(By.cssSelector(".panel-heading." + name + "-header"));
	}

	public WebElement getSidebar(String name) {
		return driver.findElement(By.cssSelector(".column." + name + "-sidebar"));
	}

	public void showBacklog() throws InterruptedException {
		getSidebar("backlog").
			findElement(By.cssSelector(".hide-icon-sidebar")).
			click();
		Thread.sleep(200);
	}

	public Integer getSidebarCount(String name) {
		String value = getSidebar(name).
			findElement(By.cssSelector(".issues-count")).
			getText();

		return parseCount(value);

	}

	public boolean accessRepo(boolean privateRepo, String usernameGithub, String passwordGithub) {
		boolean permission = false;
		
		selectRepositoryAccess(privateRepo);

		authenticate(usernameGithub, passwordGithub);

		try {
			boolean button = driver.findElement(By.id("redirectToPublicBtn")).isDisplayed();
			if (button == true){
				driver.findElement(By.id("redirectToPublicBtn")).click();
				permission = false;
			} else {
				permission = true;
			}
		} catch (NoSuchElementException e) {
			permission = true;
		}
		return permission;
	}

	private void authenticate(String userNameGithub, String passwordGithub) {
		AuthenticatePage authenticatePage = PageFactory.initElements(driver, GitHub.AuthenticatePage.class);
		authenticatePage.login(userNameGithub,passwordGithub);

		driver.manage().timeouts().implicitlyWait(1, TimeUnit.SECONDS);
		AuthorizePage authorizePage = PageFactory.initElements(driver, GitHub.AuthorizePage.class);
		authorizePage.authorizeIfNeeded();
	}

	public void selectRepositoryAccess(boolean privateRepo) {
		if (privateRepo == false) { 
			btPublicRepo.click();
		} else {
			btAllRepo.click();
		}
	}
	
	  public void selectAccessToPublicReposOnly() {
		selectRepositoryAccess(false);
	}

	protected static String getEnv(String key) {
		String value = System.getenv(key);

		if(value == null) {
		  throw new IllegalStateException(String.format("Could not find environment variable value: %s", key));
		}

		return value;
	}

	public void openColumnsModal() throws Exception {
		waitingObject(changeColumnsButton);
		changeColumnsButton.click();
	}

	public void clickAddNewColumnLink() throws Exception {
		waitingObject(addNewColumnLink);
		addNewColumnLink.click();
	}

	public void clickRemoveColumnLink() throws Exception {
		waitingObject(saveColumnsButton);
		WebElement removeColumn = driver.findElement(By.xpath("//*[@id='columnsModal']/div/div/div[2]/ul/li[4]/a"));
		removeColumn.click();
	}    

	public void saveColumnsChanges() throws Exception {
		waitingObject(saveColumnsButton);
		saveColumnsButton.click();
	}
	
}

