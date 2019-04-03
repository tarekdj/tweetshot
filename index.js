const axios = require('axios');
const cheerio = require('cheerio');
var webshot = require('webshot');

const mre = new RegExp(/https:\/\/mobile.twitter.com\/.*\/status\/[0-9]*/g);
const re = new RegExp(/https:\/\/(www.|)twitter.com\/.*\/status\/[0-9]*/g);

const formatUrl = (url) => {
    if (url.match(re)) {
        let res;
        res = url.replace('https://www.twitter.com', 'https://mobile.twitter.com');
        res = url.replace('https://twitter.com', 'https://mobile.twitter.com');
        return res;
    }

    if (url.match(mre)) {
        return url;
    }

    throw new Error('Bad url format.');
}

const getTweetData = async (url) => {
    // First, we need to format the url.
    let formattedUrl = formatUrl(url);
    try {
        // Try to get the data from twitter.
        const response = await axios.get(formattedUrl);
        const $ = cheerio.load(response.data);

        // Extract infos from the incoming data.
        const imgSrc = $('table.main-tweet td.avatar a img').attr('src');
        const fullName = $('table.main-tweet td.user-info .fullname a strong').text();
        const userName = $('table.main-tweet td.user-info .user-info-username .username').text().trim();
        const content = $('table.main-tweet td.tweet-content .tweet-text').text().trim();
        const meta = $('table.main-tweet td.tweet-content .metadata').text().trim();

        //Return the result
        return {
            imgSrc,
            fullName,
            userName,
            content,
            meta
        }
    } catch (error) {
        console.error(error);
    }
}

const defaultOptions = {
    outerBg: "#fff",
    outerWitdh: "600",
    outerPadding: "10",
    outerBRadius: "5",
    font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    avatarRadius: "5"
}

const renderTweetshot = async (data, path = './tweet1.png', options = defaultOptions) => {

    const html = `
    <html>
        <head>
            <style>
              body {
                  font-family: ${options.font}
              }
              .outer {
                  background: ${options.outerBg};
                  width: ${options.outerWitdh}px;
                  padding: ${options.outerPadding}px;
                  border-radius: ${options.outerBRadius}px;
              }
              .avatar img{
                  border-radius: ${options.avatarRadius}px;
              }
            </style>
        </head>
        <body>
            <div class="outer">
                <div class="avatar"><img src="${data.imgSrc}" /></div>
                <div class="content">${data.content}</div>
                <div class="fullname">${data.fullName}</div>
                <div class="username">${data.userName}</div>
                <div class="meta">${data.meta}"</div>
            </div>
        </body>
    </html>
    `;

    webshot(html, path, {siteType:'html', captureSelector:'.outer'}, function(err) {
        if (err) {
            console.error(err);
        }
    });

}

const tweetshot = async ($url, $path) => {
    try {
        var data = await getTweetData($url);
        renderTweetshot(data, $path);
    }
    catch (err) {
       console.error(err);
    }
}

module.exports = tweetshot;
