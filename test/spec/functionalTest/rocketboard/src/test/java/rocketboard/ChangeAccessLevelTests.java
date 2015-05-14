package rocketboard;

import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.openqa.selenium.support.PageFactory;

import rocketboardPages.GitHub;
import rocketboardPages.GitHub.AuthorizePage;

public class ChangeAccessLevelTests extends AbstractRocketboardTests {
	
	@Test
	public void changeAccessLevel() throws Exception {
		assertTrue(whenChangesAccessToOnlyPublic().isAuthorizePage());
	}

	private AuthorizePage whenChangesAccessToOnlyPublic()
			throws InterruptedException {
		rocketboardPage.openChangeAccess();
		rocketboardPage.selectAccessToPublicReposOnly();

		return PageFactory.initElements(driver, GitHub.AuthorizePage.class);
	}
}
