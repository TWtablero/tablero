package rocketboard;

import java.util.concurrent.TimeUnit;

import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

public class DriverManager {

	WebDriver driver;
	DesiredCapabilities caps = new DesiredCapabilities();

	public DriverManager(){
		super();
	}

	// Use this to manager options to tests with SauceLabs
	public void loadDriver(String location, String browser){
		if  (location.equals("localDriver")){
			this.driver = new FirefoxDriver();	
		}

		else if (location.equals("remoteDriver")){
			if (browser.equals("IE")){
				DesiredCapabilities caps = DesiredCapabilities.internetExplorer();
				caps.setCapability("platform", Platform.WIN8);
				caps.setCapability("version","11");	

			}
			else if (browser.equals("chrome")){
				DesiredCapabilities caps = DesiredCapabilities.chrome();
				caps.setCapability("platform", Platform.MAC);
				caps.setCapability("version","38");	
			}

			else if (browser.equals("firefox")){
				DesiredCapabilities caps = DesiredCapabilities.chrome();
				caps.setCapability("platform", Platform.LINUX);
				caps.setCapability("version","32");	
			}
		}

	}

	public void loadDriver(){
		this.driver = new FirefoxDriver();
		this.driver.manage().window().maximize();
		this.driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
	}

	public WebDriver getDriver(){
		return this.driver;
	}
}
