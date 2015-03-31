package rocketboard;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.support.PageFactory;

import rocketboardPages.GitHub;
import rocketboardPages.GitHub.AuthorizePage;
import rocketboardPages.GithubCredentials;
import tablero.Repository;

import java.util.List;

public class ChangeAccessLevelTests extends AbstractRocketboardTests {
    @Override
    @Before
    public void accessRepo() throws Exception {
        List<Repository> repos = getRepos();
        assertThat("there isnt any configured repos ", repos.size(), greaterThan(0));

        rocketboardPage.waitingLoading();
    }

    @Test
    public void opensReadOnly() throws Exception {
        assertThat(rocketboardPage.createIssueButtonPresent(), is(false));
    }

	@Test
	public void changeAccessLevel() throws Exception {
		givenTableroAccessToPrivateRepositories();

		assertTrue(whenChangesAccessToOnlyPublic().isAuthorizePage());
	}

	private AuthorizePage whenChangesAccessToOnlyPublic()
			throws InterruptedException {
		rocketboardPage.openChangeAccess();
		rocketboardPage.selectAccessToPublicReposOnly();

		return PageFactory.initElements(driver, GitHub.AuthorizePage.class);
	}

	private void givenTableroAccessToPrivateRepositories()
			throws InterruptedException {
        boolean privateRepo = true;
        GithubCredentials credentials = getGithubCredentials();

        rocketboardPage.openChangeAccess();
        rocketboardPage.accessRepo(privateRepo, credentials.getUserName(), credentials.getPassword());
		rocketboardPage.waitingLoading();
	}
}
