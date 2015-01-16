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
            username.sendKeys(getEnv("TABLERO_TEST_USER"));
            password.sendKeys(getEnv("TABLERO_TEST_PASS"));
            submit.click();

            return PageFactory.initElements(driver, AuthorizePage.class);
        }

        private static String getEnv(String key) {
            String value = System.getenv(key);

            if(value == null) {
                throw new IllegalStateException(String.format("Could not find environment variable value: %s", key));
            }

            return value;
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
                //No authorization required
            }
        }

        private void authorize() {
            driver.findElement(By.name("authorize"))
                    .click();
        }
    }
}
