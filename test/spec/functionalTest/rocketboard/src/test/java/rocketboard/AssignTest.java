package rocketboard;

import static org.junit.Assert.assertEquals;

import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.By;

public class AssignTest extends AbstractRocketboardTests {

	@Test
	public void AssignTest() throws Exception{
		String title = getRandomTitle();
		String desc = getRandomDescription();

		rocketboardPage.createIssue(title, desc, getRandomProject().getName());
		String idCard = rocketboardPage.getInfo(title, "id");
	
		rocketboardPage.assignMe(idCard);
		assertEquals((driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a[1]/img")).isDisplayed()), Boolean.TRUE);

		rocketboardPage.unassignMe(idCard);
		assertEquals((driver.findElement(By.xpath("//*[@id='"+idCard+"']/div[1]/a[1]/img")).isDisplayed()), Boolean.FALSE);

		idCard = "57508484"; //This id is from an issue already created. 
		rocketboardPage.alreadyAssignee(idCard);
		String btn1 = driver.findElement(
				By.xpath("//*[@id='" + idCard + "']/div[1]/div/div[2]/div/button[1]")).getText();
		assertEquals(btn1.equals("Unassign"), Boolean.TRUE);
		String btn2 = driver.findElement(
				By.xpath("//*[@id='" + idCard + "']/div[1]/div/div[2]/div/button[2]")).getText();
		assertEquals(btn2.equals("Cancel"), Boolean.TRUE);

		rocketboardPage.unassignCancel(idCard);
		assertEquals(
				(driver.findElement(By.xpath("//*[@id='" + idCard + "']/div[1]/a[1]/img"))
						.isDisplayed()),
				Boolean.TRUE);
	}

}


