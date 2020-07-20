// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// puppeteer API docs: https://github.com/puppeteer/puppeteer/blob/v5.2.0/docs/api.md#pageevalselector-pagefunction-args

// const url = 'https://www.amazon.com/Black-Swan-Improbable-Robustness-Fragility/dp/081297381X/ref=sr_1_2?dchild=1&keywords=black+swan&qid=1595188116&sr=8-2'

function scrapeProduct(url) {
  puppeteer.launch({ headless: true }).then(async (browser) => {
    // const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    // await page.evaluate(() => console.log(`url is ${location.href}`));

    const [el] = await page.$x('//*[@id="imgBlkFront"]');
    const src = await el.getProperty('src');
    const srcTxt = await src.jsonValue();

    // const titleTxt = await page.$eval('#productTitle', (txt) => txt.innerText);
    const titleTxt = await page.$eval('#productTitle', (txt) =>
      txt.textContent.split('\n').join('')
    );

    // Try loading the page and using the console to find that element.
    // document.querySelector('#txtCase')
    // --------------------------------
    // await page.$('a.buy-now'); will do the following:
    // * Run document.querySelector in the browser and return the element handle (to the Node.js environment)
    // * Run getProperty on the handle and return the result (to the Node.js environment)

    // const priceTxt = await page.$$eval('#buyNew_noncbb', (txt) =>
    //   txt.map((el) => el.innerText)
    // );

    // waiting for a selector
    // await page.waitFor('#buyNew_noncbb');

    // quick check if an element is accessible by puppeteer:
    if ((await page.$x('//*[@id="buyNew_noncbb"]/span')) !== null)
      console.log('found');
    else console.log('not found');

    // const priceTxt = await page.evaluate(() =>
    //   document.querySelector('#buyNew_noncbb').getProperty(textContent)
    // );

    // const [el2] = await page.$x('//*[@id="buyNew_noncbb"]/span');
    // const temp3 = el2.getProperty('innerText');
    // // chaining async-await functions: https://stackoverflow.com/questions/38644754/chain-async-functions
    // const priceTxt = await temp3.jsonValue();

    // ----------------------------------------------------------------

    // await page.waitForXPath('//*[@id="a-autoid-8-announce"]/span[2]/scraping');

    const [el3] = await page.$x('//*[@id="bylineInfo"]/span/span[1]/a[1]');
    // try {
    const author = await (await el3.getProperty('innerText')).jsonValue();
    // } catch (err) {
    //   console.log(err);
    // }
    // // chaining async-await functions: https://stackoverflow.com/questions/38644754/chain-async-functions
    // try {
    // const price = await temp.jsonValue();
    // } catch (err) {
    //   console.log(err);
    // }

    console.log({ srcTxt, titleTxt, author, priceTxt });

    await browser.close();

    // --------------------------------

    // with global Browser, Page, Result variables
    /**
    var Browser;
    var Page;
    var Result;

    var Launch = puppeteer.launch().then((browser) => {
      console.log('Browser Created\nCreating Blank Page');
      Browser = browser;
      // return Browser;
      // return Browser.newPage();
    });

    var GoToPage = Launch.then((resp) => Browser.newPage()).then((page) => {
      console.log('Page Created\nVisiting URL');
      Page = page;
      return Page.goto(url);
    });

    var Evaluate = GoToPage.then((resp) => {
      console.log('Website Loaded');
      console.log('Evaluating Selectors');
      Result = Page.$eval('#productTitle', (txt) => txt.innerText);
      return Result;
    })
      .then((val) => {
        console.log(Result);
        console.log('Done! Exiting');
        Browser.close();
      })
      .catch((err) => {
        console.log(err);
      });
    **/

    // --------------------------------

    // source: https://stackoverflow.com/questions/54029554/page-evaluate-wont-execute-in-a-promise-chain
    // source2: https://stackoverflow.com/questions/28250680/how-do-i-access-previous-promise-results-in-a-then-chain
    // source3 (vid): https://www.youtube.com/watch?v=lil4YCCXRYc
    // source4: https://zellwk.com/blog/converting-callbacks-to-promises/

    /**
    var Browser;
    var Page;
    var Result;

    puppeteer
      .launch()
      .then(function (browser) {
        console.log('Browser Created\nCreating Blank Page');
        Browser = browser;
        return Browser.newPage();
      })
      .then(function (page) {
        console.log('Page Created\nVisiting URL');
        Page = page;
        return Page.goto(URL);
      })
      .then(function (resp) {
        console.log('Website Loaded');
        return Page.evaluate(function () {
          // Completely Sync Stuff
          console.log('Evaluating Selectors');
          var myElems = document.getElementsByClassName('challenge-type light');
          Result = myElems;
        });
      })
      .then(function (val) {
        console.log(Result);
        console.log('Done! Exiting');
        Browser.close();
        process.exit();
      })
      .catch(function (err) {
        Browser.close();
        console.log(err);
        process.exit(1);
      });
    **/
  });
}

scrapeProduct(
  'https://www.amazon.com/Black-Swan-Improbable-Robustness-Fragility/dp/081297381X/ref=sr_1_2?dchild=1&keywords=black+swan&qid=1595188116&sr=8-2'
);
