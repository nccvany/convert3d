const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

const convert3d = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-web-security"],
  });
  const page = await browser.newPage();

  const htmlFilePath = path.join(__dirname, "dist/index.html");
  const htmlContent = fs.readFileSync(htmlFilePath, "utf8");
  await page.setContent(htmlContent);

  await page.evaluate(() => {
    const input = document.getElementById("inputUrl");
    input.innerText =
      "https://teststaccount11111.blob.core.windows.net/test-container/damaged-helmet.obj";

    const outputFormat = document.getElementById("outputFormat");
    outputFormat.innerText = "glb";
  });
  await page.content();

  const jsFilePath = path.join(__dirname, "dist/index.js");
  const jsContent = fs.readFileSync(jsFilePath, "utf8");
  await page.addScriptTag({ content: jsContent });

  await delay(5000);
  await page.waitForSelector("#heading");
  await page.waitForSelector("#content");
  // Print the updated HTML content
  await page.content();

  const outputEl = await page.$("#output");
  const data = await page.evaluate((el) => el.textContent, outputEl);

  await browser.close();

  console.log("outputData", data);
  return data;
};

convert3d();
