package rocketboard;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

import org.junit.Test;


public class CreateIssueTests extends AbstractRocketboardTests {
	
	
	/** Create an issue and check if the column backlog is correctly incremented */
	@Test
	public void createIssue() throws Exception {
		rocketboardPage.waitingLoading();
		Integer valueBefore = rocketboardPage.getCount("backlog");
		rocketboardPage.createIssue(title, desc, getRandomProject().getName(), tag);
		rocketboardPage.waitCreatedIssue(title);
		Integer valueAfter = rocketboardPage.getCount("backlog");
		assertThat(valueAfter, equalTo(valueBefore+1));
		assertThat(rocketboardPage.checkTitleFrame(title), equalTo(Boolean.TRUE));
	}
		
	@Test
	public void CreateIssueNoDescription() throws Exception {
		rocketboardPage.waitingLoading();
		rocketboardPage.createIssue(title,"", getRandomProject().getName(), tag);
		rocketboardPage.waitCreatedIssue(title);
		assertThat(rocketboardPage.checkTitleFrame(title), equalTo(Boolean.TRUE));
	}

	@Test
	public void issueAdvancedOption() throws Exception{
		rocketboardPage.waitingLoading();
		rocketboardPage.openModelCreateIssue();
		rocketboardPage.waitingFrameCreateIssueOpen();
		rocketboardPage.clickAdvanced();
		assertThat(rocketboardPage.isGithub().contains("https://github.com/"), equalTo(Boolean.TRUE));
		assertThat(rocketboardPage.isGithub().contains("issues/new"), equalTo(Boolean.TRUE));
	}
	
	@Test
	public void openCloseCreateForm_viaCloseButton() throws Exception {
		rocketboardPage.waitingLoading();
		rocketboardPage.openModelCreateIssue();
		issueModalOpened = rocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.TRUE));
		rocketboardPage.closeButton();
		issueModalOpened = rocketboardPage.modelOpened();
		assertThat(issueModalOpened, equalTo(Boolean.FALSE));
	}

	@Test
	public void openCloseCreateForm_viaXButton() throws Exception {
		rocketboardPage.waitingLoading();
		rocketboardPage.openModelCreateIssue();
		assertThat(rocketboardPage.modelOpened(), equalTo(Boolean.TRUE));
		rocketboardPage.xButton();
		assertThat(rocketboardPage.modelOpened(), equalTo(Boolean.FALSE));
	}

	@Test
	public void openCloseCreateForm_typingOutside() throws Exception {
		rocketboardPage.waitingLoading();
		rocketboardPage.openModelCreateIssue();
		rocketboardPage.waitingFrameCreateIssueOpen();
		assertThat(rocketboardPage.modelOpened(), equalTo(Boolean.TRUE));
		rocketboardPage.openModelCreateIssue();
		assertThat(rocketboardPage.modelOpened(), equalTo(Boolean.FALSE));
	}
	
}
