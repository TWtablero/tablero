package rocketboard;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertEquals;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;

import rocketboardPages.RocketboardPage;

public class EndToEndTests extends AbstractRocketboardTests{

	@Test
	public void E2E() throws Exception {
		RocketboardPage.waitingLoading();
		checkValue = RocketboardPage.createIssueGettingValue(title, desc, RocketboardPage.chooseProject());
		RocketboardPage.waitCreatedIssue(title);
		assertEquals(Integer.valueOf(checkValue[0]+1),Integer.valueOf(checkValue[1]));
		RocketboardPage.moveIssue(title, "2");
		RocketboardPage.moveIssue(title, "3");
		RocketboardPage.moveIssue(title, "4");	
		RocketboardPage.moveIssue(title, "5");
		Boolean issueLaunched = RocketboardPage.checkIssueLaunched(messageSucessRocket);
		assertThat(issueLaunched, equalTo(Boolean.TRUE));
	}
}