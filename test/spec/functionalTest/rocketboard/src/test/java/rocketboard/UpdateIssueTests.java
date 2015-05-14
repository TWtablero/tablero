package rocketboard;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.openqa.selenium.By;


public class UpdateIssueTests extends AbstractRocketboardTests {

	@Test
	public void moveCheckingValues() throws Exception {
		rocketboardPage.waitingLoading();
		rocketboardPage.createIssue(title, desc, getRandomProject().getName());
		
		checkValue = rocketboardPage.moveIssueGettingValue(title, "2");
		assertThat(Integer.valueOf(checkValue[0]+1), equalTo(Integer.valueOf(checkValue[1])));
		
		checkValue = rocketboardPage.moveIssueGettingValue(title, "3");
		assertThat(Integer.valueOf(checkValue[0]+1), equalTo(Integer.valueOf(checkValue[1])));
		
		checkValue = rocketboardPage.moveIssueGettingValue(title, "4");
		assertThat(Integer.valueOf(checkValue[0]+1), equalTo(Integer.valueOf(checkValue[1])));
		
		checkValue = rocketboardPage.moveIssueGettingValue(title, "5");
		assertThat(Integer.valueOf(checkValue[0]+1), equalTo(Integer.valueOf(checkValue[1])));		
	}

	// @Test
	// public void setLabel() throws Exception {
	// 	String repoCreateIssue = getRandomProject().getName();
	// 	rocketboardPage.waitingLoading();
	// 	rocketboardPage.createIssue(title, desc, repoCreateIssue);
	// 	String href = rocketboardPage.getInfo(title, "href");
	// 	String id = rocketboardPage.getInfo(title, "id");
	// 	rocketboardPage.restRequest(href, "[\"bug\"]");
	// 	rocketboardPage.visible(id);
	// 	String label = driver.findElement(By.xpath("//*[@id='"+id+"']/div[3]/span")).getText();
	// 	assertEquals(label.equals("bug"), Boolean.TRUE);
	// }
	
}