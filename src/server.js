'use strict';

const { readFileSync } = require('fs');
const fs = require('fs');
const RedditScraper = require('./reddit.scraper');
const Downloader = require('./downloader');
const Cache = require('./cache');

const jobs = new Map();

(async () => {
    Downloader.updateYtdlp();
    Cache.readAllDoneItemsFromIngested();

    const r = new RedditScraper();
    r.init();

    // load file lines into string array
    let subreddits = readFileSync('/assets/subreddits.txt').toString().replace(/\r\n/g,'\n').split('\n');
    
    // dedupe
    subreddits = subreddits.filter(function (value, index, array) { 
        return array.indexOf(value) === index;
    });

    console.log('loaded ' + subreddits.length + ' subreddits!');

    for(const subreddit of subreddits) {
        console.log('starting ingestion of ' + subreddit + ' subreddit...');
        if (subreddit.trim() != "") {
            const urls = await r.getSubredditMediaUrls(subreddit);
 
            if (urls.length > 0) {
                const subdir = subreddit.substr(3);
                fs.mkdir('/downloads/' + subdir, { recursive: true }, (err) => {
                    if (err) throw err;
                });

                for (const url of urls) {
                    if (Cache.checkIfItemIsIngested(url)) {
                        console.log('skipping ingestion of ' + url);
                        continue;
                    }

                    console.log('attempting to download ' + url);
                    Downloader.downloadMediaFromUrl(url, subdir); // remove /r/<subreddit> prefix
                    Cache.writePostAsIngested(url);
                }    
            }
        }
    }
})();

const express = require('express');
const app = express();
const port = 3000;

app.get('/status', (req, res) => {
    res.json({
        "status": "ok"
    });
});

const server = app.listen(port, () => console.log(`App listening on port ${port}!`));
server.setTimeout(800 * 1000);
