const cheerio = require('cheerio');
const random = require('random');
const puppeteer = require('puppeteer');
const fs = require('fs');

const maxPageCount = 10;

class RedditScraper {
    #browser = null;
    pageCount = 1;

    async getSubredditMediaUrls(subreddit) {
        const startTime = new Date();
        console.log(`Task started at ${startTime.toLocaleString()}`);
        console.log('Starting headless browser...');
        this.#browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});//, dumpio: true});

        this.#browser.on('targetcreated', () => {
            this.pageCount += 1;
        });
        this.#browser.on('targetdestroyed', () => {
            this.pageCount -= 1;
        });

        const page = await this.#browser.newPage();
        await page.setDefaultNavigationTimeout(120000); // 120 secs
        await page.setCacheEnabled(false);
        await page.setViewport({
            width: 1952, //random.int(1200, 1920),
            height: 1124 //random.int(800, 1080)
        });
        await page.setCookie({
            'name': 'over18',
            'value': '1',
            'domain': '.reddit.com'
        });

        const redditUrl = 'https://www.reddit.com' + subreddit + '/top/?t=all';
        console.log('Navigating to ' + redditUrl);
        await page.goto(redditUrl);

        await Promise.all([
            page.waitForFunction(() => document.readyState === "complete"),
            //page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);

        console.log('Scrolling to bottom of page; this will take awhile...');
        await this.scrollPageToBottom(page);

        const html = await page.evaluate(() => document.documentElement.outerHTML);
        const $ = cheerio.load(html);

        const links = $('a');
        let filteredLinks = [];
        $(links).each(function(i, link){
            const url = $(link).attr('href');
            if (url && url.toLowerCase().indexOf(subreddit.toLowerCase()) > -1 && url.indexOf('comments') > -1) {
                filteredLinks.push('https://www.reddit.com' + url);
            }
        });

        // dedupe
        filteredLinks = filteredLinks.filter(function (value, index, array) { 
            return array.indexOf(value) === index;
        });

        if (filteredLinks.length == 0) {
            console.log('no elements found in subreddit, writing screenshot for ' + subreddit);
            //await page.screenshot({ path: '/opt/app/screenshot-' + subreddit +'.png', fullPage: true });
            await page.screenshot({ path: '/downloads/screenshot-' + subreddit.substr(3) +'.png'});
        }

        await page.close();
        await this.#browser.close();

        console.log(filteredLinks);
        return filteredLinks;
    }

    async scrollPageToBottom(page) {
        await page.mouse.click(1900, 1096);

        for (let i = 1; i < random.int(120, 150); i++) {
            for(let j = 0; j < random.int(20, 100); j++) {
                await page.keyboard.press('PageDown');
                await page.keyboard.press('ArrowDown');
            }
            await page.waitForTimeout(random.int(1, 5) * random.int(100, 150));
        }
    }

    init() {

    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = RedditScraper;
