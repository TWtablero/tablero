package rocketboard;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

import org.junit.Test;


public class CreateIssueTests extends AbstractRocketboardTests {
	
	
	/** Create an issue and check if the column backlog is correctly incremented */
	@Test
	public void createIssue() throws Exception {
		Integer valueBefore = rocketboardPage.getCount("backlog");
		rocketboardPage.createIssue(title, desc, getRandomProject().getName());
		rocketboardPage.waitCreatedIssue(title);
		Integer valueAfter = rocketboardPage.getCount("backlog");
		assertThat(valueAfter, equalTo(valueBefore+1));
		assertThat(rocketboardPage.checkTitleFrame(title), equalTo(Boolean.TRUE));

		rocketboardPage.createIssue(title,"", getRandomProject().getName());
		rocketboardPage.waitCreatedIssue(title);
		assertThat(rocketboardPage.checkTitleFrame(title), equalTo(Boolean.TRUE));

		rocketboardPage.openModelCreateIssue();
		rocketboardPage.waitingFrameCreateIssueOpen();
		assertThat(rocketboardPage.modelOpened(), equalTo(Boolean.TRUE));
		rocketboardPage.closeButton();
		assertThat(rocketboardPage.modelOpened(), equalTo(Boolean.FALSE));
	}
	
}
