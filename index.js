const puppeteer = require('puppeteer');

const tweetshot = async ($url, $path) => {
    try {
        // launch the headless browser
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        // Adjustments particular to this page to ensure we hit desktop breakpoint.
        page.setViewport({width: 1000, height: 600, deviceScaleFactor: 1});

        // Goto tweet page
        await page.goto($url);
        await page.waitForSelector('div.js-tweet-stats-container.tweet-stats-container');

        // Cleanup the tweet.
        await page.evaluate(() => {
            jQuery(document).ready(function() {
                jQuery(`
                    .stats, .follow-bar,
                    .translate-button,
                    .stream-item-footer,
                    .ProfileTweet-action,
                    .replies-to,
                    .permalink-footer
                `).hide();
                jQuery('.permalink-tweet')
                    .css('border-radius', '0px')
                    .css('border', '0px');
                jQuery('.PermalinkOverlay-with-background').css('background', 'white');
                jQuery('.PermalinkOverlay .permalink').css('border', '0px');
            });
        });

        /**
         * Takes a screenshot of a DOM element on the page, with optional padding.
         *
         * @param {!{path:string, selector:string, padding:(number|undefined)}=} opts
         * @return {!Promise<!Buffer>}
         */
        async function screenshotDOMElement(opts = {}) {
            const padding = 'padding' in opts ? opts.padding : 0;
            const path = 'path' in opts ? opts.path : null;
            const selector = opts.selector;

            if (!selector)
                throw Error('Please provide a selector.');

            const rect = await page.evaluate(selector => {
                const element = document.querySelector(selector);
                if (!element)
                    return null;
                const {x, y, width, height} = element.getBoundingClientRect();
                return {left: x, top: y, width, height, id: element.id};
            }, selector);

            if (!rect)
                throw Error(`Could not find element that matches selector: ${selector}.`);
            await page.setViewport({width: 1000, height: rect.height + rect.top - padding, deviceScaleFactor: 1});
            return await page.screenshot({
                path,
                clip: {
                    x: rect.left - padding,
                    y: rect.top - padding,
                    width: rect.width + padding * 2,
                    height: rect.height + padding * 2
                }
            });
        }
        await setTimeout(async() => {}, 1000);
        await screenshotDOMElement({
            path: $path,
            selector: 'div.tweet.permalink-tweet',
            padding: -16
        });

        browser.close();
    }
    catch (error) {
        throw new Error(error.message);
    }
}

module.exports = tweetshot;
