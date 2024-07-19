const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-web-security"],
  });
  const page = await browser.newPage();

  const htmlFilePath = path.join(__dirname, "dist/index.html");
  const htmlContent = fs.readFileSync(htmlFilePath, "utf8");
  await page.setContent(htmlContent);

  const jsFilePath = path.join(__dirname, "dist/assets/index-BOq-Rxuo.js");
  const jsContent = fs.readFileSync(jsFilePath, "utf8");
  await page.addScriptTag({ content: jsContent });

  await delay(5000);
  await page.waitForSelector("#heading");
  await page.waitForSelector("#content");
  // Print the updated HTML content
  const updatedContent = await page.content();
  console.log(updatedContent);

  await page.screenshot({ path: "example.png" });

  await browser.close();
})();
