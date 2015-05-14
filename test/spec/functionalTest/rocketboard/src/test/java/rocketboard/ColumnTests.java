package rocketboard;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;

public class ColumnTests extends AbstractRocketboardTests {

    @Test
    public void ColumnTests() throws Exception {
        rocketboardPage.openColumnsModal();
        rocketboardPage.clickAddNewColumnLink();

        WebElement newColumnInput = driver.findElement(By.cssSelector("ul.columns-container li:last-child input"));
        newColumnInput.sendKeys("New Column");

        rocketboardPage.saveColumnsChanges();
        rocketboardPage.waitingLoading();

        assertTrue(driver.findElement(By.xpath("/html/body/div[2]/div[3]/div[4]/div/div[1]/h3")).isDisplayed());

        rocketboardPage.openColumnsModal();
        rocketboardPage.clickRemoveColumnLink();
        rocketboardPage.saveColumnsChanges();
        rocketboardPage.waitingLoading();

        assertTrue(driver.findElements(By.xpath("/html/body/div[2]/div[3]/div[4]/div/div[1]/h3")).isEmpty());
    }
    
}
