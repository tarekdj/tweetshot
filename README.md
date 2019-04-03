# Tweetshot
Convert a tweet url to image. Inspired by https://twitter.com/stolinski/status/994690885991329792

The preview below is made with this librarie

![Original tweet from @stolinski](https://raw.githubusercontent.com/tarekdj/tweetshot/master/tweet.png)

## How it works
~~It launches a headless chrome and take a screenshot from the provided url.~~
It uses [axios](https://github.com/axios/axios) to fetch the data from https://mobile.twitter.com then builds up the image using [cheerio](https://github.com/cheeriojs/cheerio) and [webshot](https://github.com/Grace951/node-webshot).



## Usage

```
  Usage: tweetshot <url> <path>

  Example:

  tweetshot https://twitter.com/stolinski/status/994690885991329792 ./tweet.png


  Options:

    -V, --version  output the version number
    -h, --help     output usage information
```

# Todo
- [ ] Fix some arbitrary errors
- [ ] Write tests
