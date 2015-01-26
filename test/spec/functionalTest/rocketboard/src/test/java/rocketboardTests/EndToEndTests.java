package rocketboardTests;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class EndToEndTests extends AbstractRocketboardTests{

	@Test
	public void E2E() throws Exception {
		rocketboardPage.waitingLoading();
		checkValue = rocketboardPage.createIssueGettingValue(title, desc, getRandomProject().getName());
		rocketboardPage.waitCreatedIssue(title);
		assertEquals(Integer.valueOf(checkValue[0]+1),Integer.valueOf(checkValue[1]));
		rocketboardPage.moveIssue(title, "2");
		rocketboardPage.moveIssue(title, "3");
		rocketboardPage.moveIssue(title, "4");
		rocketboardPage.moveIssue(title, "5");
		Boolean issueLaunched = rocketboardPage.checkIssueLaunched(messageSucessRocket);
		assertThat(issueLaunched, equalTo(Boolean.TRUE));
	}
}