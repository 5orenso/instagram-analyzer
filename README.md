# Instagram analyzer

[![Build Status](https://travis-ci.org/5orenso/instagram-analyzer.svg)](https://travis-ci.org/5orenso/instagram-analyzer)
[![Coverage Status](https://coveralls.io/repos/5orenso/instagram-analyzer/badge.svg)](https://coveralls.io/r/5orenso/instagram-analyzer)

A node.js lib to get recent photos related to a tag.

## Howto

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

