package rocketboard;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;

import rocketboardPages.RocketboardPage;


public class CreateIssueTests extends AbstractRocketboardTests {
	
	
	/** Create an issue and check if the column backlog is correctly incremented */
	@Test
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
	public void CreateIssueNoDescription() throws Exception {
		RocketboardPage.waitingLoading();
		RocketboardPage.createIssue(title,"", RocketboardPage.chooseProject());
		RocketboardPage.waitCreatedIssue(title);
		assertThat(RocketboardPage.checkTitleFrame(title), equalTo(Boolean.TRUE));
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
	
}
