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

        public void login(String usernameGithub, String passwordGithub) {
            username.sendKeys(usernameGithub);
            password.sendKeys(passwordGithub);
            submit.click();
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
			} catch (NoSuchElementException notAuthorizationRequired) {
            }
        }

		public boolean isAuthorizePage() {
			try {
				getAuthorizeButton();
				return true;
			} catch (NoSuchElementException e) {
				return false;
			}
		}

        private void authorize() {
			getAuthorizeButton().click();
        }

		private WebElement getAuthorizeButton() {
			return driver.findElement(By.name("authorize"));
		}
    }
}
