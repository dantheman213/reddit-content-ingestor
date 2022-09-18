const fs = require('fs');

class Cache {
    static ingestedItems = new Map();

    static readAllDoneItemsFromIngested() {
        if (fs.existsSync('/assets/ingested.txt')) {
            const items = fs.readFileSync('/assets/ingested.txt').toString().replace(/\r\n/g,'\n').split('\n');
            for (const item of items) {
                Cache.ingestedItems.set(item, 'true');
            }

            console.log('loaded ' + items.length + ' items into cache...');
        } else {
            console.log('no cache exists... skipping!');
        }
    }
    
    static checkIfItemIsIngested(url) {
        return Cache.ingestedItems.has(url);
    }

    static writePostAsIngested(url) {
        if (!Cache.ingestedItems.has(url)) {
            Cache.ingestedItems.set(url, 'true');
            fs.writeFileSync('/assets/ingested.txt', url + '\n', { flag: "a+" });
        }
    }

}

module.exports = Cache;