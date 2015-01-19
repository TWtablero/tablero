package rocketboard;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.openqa.selenium.By;

public class AssigneTests extends AbstractRocketboardTests {
	
	@Test
	public void AssignMeCard() throws Exception{
		RocketboardPage.waitingLoading();
		RocketboardPage.createIssue(title, desc, RocketboardPage.chooseProject());
		RocketboardPage.waitCreatedIssue(title);
		String idCard = RocketboardPage.getInfo(title, "id");
		RocketboardPage.assignMe(idCard);
		assertEquals((driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a[1]/img")).isDisplayed()), Boolean.TRUE);
	}
	
	@Test
	public void UnassignLabel() throws Exception {
		RocketboardPage.waitingLoading();
		RocketboardPage.createIssue(title, desc, repoCreateIssue);
		String href = RocketboardPage.getInfo(title, "href");
		String idCard = RocketboardPage.getInfo(title, "id");
		RocketboardPage.restAssign(href, "{\"assignee\":\"nayaramoura\"}");
		RocketboardPage.visible(idCard);
		RocketboardPage.alreadyAssignee(idCard);
		String btn1 = driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/div/div[2]/div/button[1]")).getText();
		assertEquals(btn1.equals("Unassign"), Boolean.TRUE);
		String btn2 = driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/div/div[2]/div/button[2]")).getText();
		assertEquals(btn2.equals("Cancel"), Boolean.TRUE);
	}
	
	@Test
	public void CancelUnassignAction() throws Exception {
		RocketboardPage.waitingLoading();
		RocketboardPage.createIssue(title, desc, repoCreateIssue);
		String href = RocketboardPage.getInfo(title, "href");
		String idCard = RocketboardPage.getInfo(title, "id");
		RocketboardPage.restAssign(href, "{\"assignee\":\"nayaramoura\"}");
		RocketboardPage.visible(idCard);
		RocketboardPage.alreadyAssignee(idCard);
		RocketboardPage.unassignCancel(idCard);
		assertEquals((driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a[1]/img")).isDisplayed()), Boolean.TRUE);
	}
	
	@Test
	public void ConfirmUnassignAction() throws Exception {
		RocketboardPage.waitingLoading();
		RocketboardPage.createIssue(title, desc, repoCreateIssue);
		String href = RocketboardPage.getInfo(title, "href");
		String idCard = RocketboardPage.getInfo(title, "id");
		RocketboardPage.restAssign(href, "{\"assignee\":\"nayaramoura\"}");
		RocketboardPage.visible(idCard);
		RocketboardPage.alreadyAssignee(idCard);
		RocketboardPage.unassignConfirm(idCard);
		assertEquals((driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a[1]/img")).isDisplayed()), Boolean.FALSE);
	}
	
	@Test
	public void UnassignOwnUser() throws Exception{
		RocketboardPage.waitingLoading();
		RocketboardPage.createIssue(title, desc, RocketboardPage.chooseProject());
		RocketboardPage.waitCreatedIssue(title);
		String idCard = RocketboardPage.getInfo(title, "id");
		RocketboardPage.assignMe(idCard);
		RocketboardPage.unassignMe(idCard);
		assertEquals((driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a[1]/img")).isDisplayed()), Boolean.FALSE);
	}
	
	
}
	
	