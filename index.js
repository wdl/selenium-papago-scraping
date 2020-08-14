const {Builder, By, Key, until} = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const htmlToText = require('html-to-text');

module.exports = async (sk, tk, text) => {
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build()

    const textEncoded = encodeURI(text)
    await driver.get(`https://papago.naver.com/?sk=${sk}&tk=${tk}&st=${textEncoded}`)
    await driver.wait(until.elementLocated(By.xpath('//div[@id="txtTarget"]')), 10 * 1000)

    const translatedHtml = await driver.wait(async () => {
        const txtTargetElement = await driver.findElement(By.xpath('//div[@id="txtTarget"]'))
        const txtTarget = await txtTargetElement.getAttribute('innerHTML')
        return txtTarget
    }, 10 * 1000)

    await driver.quit()

    return htmlToText.fromString(translatedHtml)
}