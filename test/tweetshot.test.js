const fs = require('fs');
const tweetshot = require('../index');
const looksSame = require('looks-same');
jest.setTimeout(30000);

test('image is generated', async () => {
    await tweetshot('https://twitter.com/stolinski/status/994690885991329792', 'test.png');

    expect(fs.existsSync('./test.png')).toBe(true);
    fs.unlink('./test.png', (err) => { 
        if (err)
            console.error(err)
    });
});