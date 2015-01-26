package rocketboardTests;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import rocketboardPages.GithubCredentials;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;


public class ManageBoardTests extends AbstractRocketboardTests {


	@Override
	public void accessRepo() throws Exception {
	}

	@Test
	public void selectingRepository() throws Exception {
		super.accessRepo();
		
		String [] dispatcher = {"dispatcher"};
		String [] platform = {"platform"};
		String [] userAgent = {"userAgent"};
		String [] projectIssue = {"projectIssue"};
		String [] pages = {"pages"};
		String [] all = {"all"};

		rocketboardPage.waitingLoading();
		rocketboardPage.uncheckAllRepo(privateRepo);
		
		rocketboardPage.clickRepo(dispatcher);
		assertTrue(rocketboardPage.isRepoSelected(dispatcher[0]));
		rocketboardPage.clickRepo(dispatcher);

		rocketboardPage.clickRepo(platform);
		assertTrue(rocketboardPage.isRepoSelected(platform[0]));
		rocketboardPage.clickRepo(platform);

		rocketboardPage.clickRepo(userAgent);
		assertTrue(rocketboardPage.isRepoSelected(userAgent[0]));
		rocketboardPage.clickRepo(userAgent);
		
		try {
			   driver.findElement(By.id("repository-4"));
			   rocketboardPage.clickRepo(projectIssue);
			   assertThat(rocketboardPage.isRepoSelected(projectIssue[0]), equalTo(Boolean.TRUE));
			   rocketboardPage.clickRepo(projectIssue);
			     
			} 
		catch (NoSuchElementException e) { }
		
		rocketboardPage.clickRepo(pages);
		assertThat(rocketboardPage.isRepoSelected(pages[0]), equalTo(Boolean.TRUE));
		rocketboardPage.clickRepo(pages);

		rocketboardPage.clickRepo(all);
		assertThat(rocketboardPage.isRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		assertThat(rocketboardPage.isRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		assertThat(rocketboardPage.isRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
		assertThat(rocketboardPage.isRepoSelected(pages[0]), equalTo(Boolean.TRUE));
		try {
			   driver.findElement(By.id("repository-4"));
			   assertThat(rocketboardPage.isRepoSelected(projectIssue[0]), equalTo(Boolean.TRUE));
			} 
		catch (NoSuchElementException e) { }
	}
	
	@Test
	public void selectingRepositoryWithoutPrivate() throws Exception {
		GithubCredentials credentials = getGithubCredentials();		
		
		rocketboardPage.accessRepo(false,credentials.getUserName(),credentials.getPassword());
		rocketboardPage.waitingLoading();

		String [] dispatcher = {"dispatcher"};
		String [] platform = {"platform"};
		String [] userAgent = {"userAgent"};
		String [] pages = {"pages"};
		String [] all = {"all"};

		rocketboardPage.waitingLoading();
		assertThat(rocketboardPage.isPrivatePresent(), equalTo(Boolean.FALSE));
		
		
		rocketboardPage.uncheckAllRepo(privateRepo);
		
		rocketboardPage.clickRepo(dispatcher);
		assertThat(rocketboardPage.isRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		rocketboardPage.clickRepo(dispatcher);

		rocketboardPage.clickRepo(platform);
		assertThat(rocketboardPage.isRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		rocketboardPage.clickRepo(platform);

		rocketboardPage.clickRepo(userAgent);
		assertThat(rocketboardPage.isRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
		rocketboardPage.clickRepo(userAgent);
		
		rocketboardPage.clickRepo(pages);
		assertThat(rocketboardPage.isRepoSelected(pages[0]), equalTo(Boolean.TRUE));
		rocketboardPage.clickRepo(pages);

		rocketboardPage.clickRepo(all);
		assertThat(rocketboardPage.isRepoSelected(dispatcher[0]), equalTo(Boolean.TRUE));
		assertThat(rocketboardPage.isRepoSelected(platform[0]), equalTo(Boolean.TRUE));
		assertThat(rocketboardPage.isRepoSelected(userAgent[0]), equalTo(Boolean.TRUE));
		assertThat(rocketboardPage.isRepoSelected(pages[0]), equalTo(Boolean.TRUE));
	}

	@Test
	public void toggleBacklog() throws Exception {
		GithubCredentials credentials = getGithubCredentials();		
		rocketboardPage.accessRepo(false,credentials.getUserName(),credentials.getPassword());
		
		WebDriverWait wait = new WebDriverWait(this.driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div[class*='panel-heading backlog'] > span.issues-count")));
		wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector("div.blockUI.blockMsg.blockPage h1#loading.loading")));
		
		Integer backlogCount = rocketboardPage.getCount("backlog");
		rocketboardPage.hideBacklog();

		assertFalse(rocketboardPage.getColumn("backlog").isDisplayed());
		assertThat(rocketboardPage.getSidebarCount("backlog"), is(backlogCount));

		rocketboardPage.showBacklog();
		assertTrue(rocketboardPage.getColumn("backlog").isDisplayed());
		assertThat(rocketboardPage.getCount("backlog"), is(backlogCount));
	}
}
