package rocketboardPages;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

/**
 * Created by gmatheu on 16/01/15.
 */
public class GitHub {
    public static class AuthenticatePage {
        private WebDriver driver;

        @FindBy(id = "login_field")
        WebElement username;

        @FindBy(id = "password")
        WebElement password;

        @FindBy(name = "commit")
        WebElement submit;

        public AuthenticatePage(WebDriver driver) {
            this.driver = driver;
        }

        public AuthorizePage login() {
            username.sendKeys("testusertwbr");
            password.sendKeys("t3stus3r");
            submit.click();

            return PageFactory.initElements(driver, AuthorizePage.class);
        }
    }

    public static class AuthorizePage {
        private WebDriver driver;

        public AuthorizePage(WebDriver driver) {
            this.driver = driver;
        }

        public void authorizeIfNeeded(){
            try {
                authorize();
            } catch (NoSuchElementException e) {
            }
        }

        private void authorize() {
            driver.findElement(By.name("authorize"))
                    .click();
        }
    }
}
