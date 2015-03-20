# Instagram analyzer

[![Build Status](https://travis-ci.org/5orenso/instagram-analyzer.svg)](https://travis-ci.org/5orenso/instagram-analyzer)
[![Coverage Status](https://coveralls.io/repos/5orenso/instagram-analyzer/badge.svg)](https://coveralls.io/r/5orenso/instagram-analyzer)

A node.js lib to get recent photos related to a tag.

## npm install

```bash
npm install instagram-analyzer
```

Then you can use it like this:
```javascript
var when   = require('when');
var Instagram = require('instagram-analyzer');

var insta = new Instagram({
    instagram: {
        clientId: 'your client id',
        clientSecret: 'your client secret'
    }
});

when(insta.getRecentMediasForTagFull('sorenso', 'sorenso', 2))
    .done(function (mediaList) {
        for (var i = 0; i < mediaList.length; i++) {
            console.log('#' + i + ': ', mediaList[i].caption.text);
            console.log('    ', 'Likes (count/elements):', mediaList[i].likes.count, mediaList[i].likes.data.length);
            console.log('    ', 'Comments (count/elements):', mediaList[i].comments.count, mediaList[i].comments.data.length);
        }
    }, console.error);

```


## Howto run app

Copy `config-dist.js` to `config.js` and insert your Instagram clientId and clientSecret.
```bash
cp ./config/config-dist.js ./config/config.js
vim ./config/config.js
```

Run the app with the tag you want to filter on.
```bash
node app/app.js -t sorenso -l 10
```

You can also filter by tag and user
```bash
node app/app.js -t sorenso -u sorenso -l 10
```

