const fs = require('fs')
const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();
options.setUserPreferences({
    'profile.default_content_setting_values.notifications': 2
});
const driver = new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();

const {postUrl,user} = JSON.parse(fs.readFileSync(__dirname+"/account.json").toString());

var count = 0;
async function execute(obj) {
    await driver.get('https://www.facebook.com/');
    await driver.findElement(By.xpath('//*[@id="email"]')).sendKeys(obj.account);
    await driver.findElement(By.xpath('//*[@id="pass"]')).sendKeys(obj.password, Key.RETURN);
    await new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        },500)
    })
    await driver.get(postUrl);
    while (await driver.getCurrentUrl()!=postUrl){
        await driver.get(postUrl);
    }
    try{
        await driver.findElement(By.css('[aria-label="讚"]')).sendKeys(Key.ENTER);
        while(await driver.findElement(By.css('[aria-label="移除讚"]'))){
            await driver.findElement(By.css('[aria-label="讚"]')).sendKeys(Key.ENTER);
        }
    }catch(e){}
    await driver.manage().deleteCookie('xs');
    count++;
    if(count<user.length) execute(user[count])
};
execute(user[count]);

