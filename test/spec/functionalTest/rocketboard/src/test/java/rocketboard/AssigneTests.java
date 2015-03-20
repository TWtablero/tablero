package rocketboard;

import static org.junit.Assert.assertEquals;

import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.By;

public class AssigneTests extends AbstractRocketboardTests {

	@Test
	public void AssignMeCard() throws Exception{
		rocketboardPage.waitingLoading();
		rocketboardPage.createIssue(title, desc, getRandomProject().getName(), tag);
		rocketboardPage.waitCreatedIssue(title);
		String idCard = rocketboardPage.getInfo(title, "id");
		rocketboardPage.assignMe(idCard);
		assertEquals((driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a[1]/img")).isDisplayed()), Boolean.TRUE);
	}

	@Test
	@Ignore
	public void UnassignLabel() throws Exception {
		rocketboardPage.waitingLoading();
		rocketboardPage.createIssue(title, desc, getRandomProject().getName(), tag);
		String href = rocketboardPage.getInfo(title, "href");
		String idCard = rocketboardPage.getInfo(title, "id");
		rocketboardPage.restAssign(href, "{\"assignee\":\"nayaramoura\"}");
		rocketboardPage.visible(idCard);
		rocketboardPage.alreadyAssignee(idCard);
		String btn1 = driver.findElement(
				By.xpath("//*[@id='" + idCard + "']/div[1]/div/div[2]/div/button[1]")).getText();
		assertEquals(btn1.equals("Unassign"), Boolean.TRUE);
		String btn2 = driver.findElement(
				By.xpath("//*[@id='" + idCard + "']/div[1]/div/div[2]/div/button[2]")).getText();
		assertEquals(btn2.equals("Cancel"), Boolean.TRUE);
	}

	@Test
	@Ignore
	public void CancelUnassignAction() throws Exception {
		String repoCreateIssue = getRandomProject().getName();
		rocketboardPage.waitingLoading();
		rocketboardPage.createIssue(title, desc, repoCreateIssue, tag);
		String href = rocketboardPage.getInfo(title, "href");
		String idCard = rocketboardPage.getInfo(title, "id");
		rocketboardPage.restAssign(href, "{\"assignee\":\"nayaramoura\"}");
		rocketboardPage.visible(idCard);
		rocketboardPage.alreadyAssignee(idCard);
		rocketboardPage.unassignCancel(idCard);
		assertEquals(
				(driver.findElement(By.xpath("//*[@id='" + idCard + "']/div[1]/a[1]/img"))
						.isDisplayed()),
				Boolean.TRUE);
	}

	@Test
	public void UnassignOwnUser() throws Exception{
		rocketboardPage.waitingLoading();
		rocketboardPage.createIssue(title, desc, getRandomProject().getName(), tag);
		rocketboardPage.waitCreatedIssue(title);
		String idCard = rocketboardPage.getInfo(title, "id");
		rocketboardPage.assignMe(idCard);
		rocketboardPage.unassignMe(idCard);
		assertEquals((driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a[1]/img")).isDisplayed()), Boolean.FALSE);
	}

}


