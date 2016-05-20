# site-speed

> Runs PSI (PageSpeed Insights) for your site


## Install

```
$ npm install --save site-speed
```


## Usage

```js
var ss = require('./index.js');

var pages = [
    'https://github.com/',
    'https://www.google.com/',
]


ss.run(pages)
```

## CLI

```
$ npm install --global site-speed
```


## ToDo

- Add file name for saving
- Add primer to make sure pages are cached
- Add enpoint to hit before/after running tests