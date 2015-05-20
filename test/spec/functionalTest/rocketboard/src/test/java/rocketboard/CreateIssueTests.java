package rocketboard;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import org.junit.Test;

public class CreateIssueTests extends AbstractRocketboardTests {
	
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
	}
}
