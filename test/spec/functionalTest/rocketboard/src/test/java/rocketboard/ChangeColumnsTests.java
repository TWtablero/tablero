package rocketboard;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import static org.junit.Assert.assertTrue;

public class ChangeColumnsTests extends AbstractRocketboardTests {

    @Test
    public void AddNewColumn() throws Exception {
        rocketboardPage.waitingLoading();
        rocketboardPage.openColumnsModal();
        rocketboardPage.clickAddNewColumnLink();

        WebElement newColumnInput = driver.findElement(By.cssSelector("ul.columns-container li:last-child input"));
        newColumnInput.sendKeys("New Column");

        rocketboardPage.saveColumnsChanges();
        rocketboardPage.waitingLoading();

        assertTrue(driver.findElement(By.cssSelector(".panel-heading.new-column-header")).isDisplayed());
    }

    @Test
    public void RemoveColumn() throws Exception {
        rocketboardPage.waitingLoading();
        rocketboardPage.openColumnsModal();
        rocketboardPage.clickAddNewColumnLink();

        WebElement newColumnInput = driver.findElement(By.cssSelector("ul.columns-container li:last-child input"));
        newColumnInput.sendKeys("New Column");

        rocketboardPage.saveColumnsChanges();
        rocketboardPage.waitingLoading();

        rocketboardPage.openColumnsModal();
        newColumnInput = driver.findElement(By.cssSelector("ul.columns-container li:last-child input"));
        newColumnInput.sendKeys("");
        rocketboardPage.saveColumnsChanges();
        rocketboardPage.waitingLoading();

        assertTrue(driver.findElement(By.cssSelector(".panel-heading.new-column-header")).isDisplayed());
    }
    
}
