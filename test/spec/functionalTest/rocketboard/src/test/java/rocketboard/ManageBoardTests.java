package rocketboard;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import java.util.List;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import tablero.Repository;


public class ManageBoardTests extends AbstractRocketboardTests {

	@Test
	public void selectingRepository() throws Exception {
		rocketboardPage.waitingLoading();
		rocketboardPage.uncheckAllRepo(privateRepo);

		List<Repository> repositoryList = getRepos();

		for(Repository repo : repositoryList) {
			rocketboardPage.clickRepo(repo.getKey());
			assertTrue(rocketboardPage.isRepoSelected(repo.getKey()));
			rocketboardPage.clickRepo(repo.getKey());
		}

		for(Repository repo : repositoryList) {
			rocketboardPage.clickRepo(repo.getKey());
		}

		for(Repository repo : repositoryList) {
			assertThat(rocketboardPage.isRepoSelected(repo.getKey()), equalTo(Boolean.TRUE));
		}

		Integer backlogCount = rocketboardPage.getCount("backlog");
		rocketboardPage.hideBacklog();

		assertFalse(rocketboardPage.getColumn("backlog").isDisplayed());
		assertThat(rocketboardPage.getSidebarCount("backlog"), is(backlogCount));

		rocketboardPage.showBacklog();
		assertTrue(rocketboardPage.getColumn("backlog").isDisplayed());
		assertThat(rocketboardPage.getCount("backlog"), is(backlogCount));
	}
}