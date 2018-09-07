# site-speed

> Runs PSI (PageSpeed Insights) for your site


## Install

```
$ npm install --save site-speed
```


## Usage

```js
var ss = require('site-speed');

var options = {
    output: 'example_', // default: "./data/"
    primer: true, 		// default: false
    googleKey: 'xxxxxxxx-xxxx'
}

var pages = [
    'https://github.com/',
    'https://www.google.com/',
]

ss.run(pages, options)

```

__primer__ used to hit page once before collecting speed data in case the cache needs to be primed.

__output__ folder or prefix of files to be saved.

## CLI

```
$ npm install --global site-speed
```

## Latest

* Added YellowLab Tools as second engine to generate speed statistics

## ToDo

- Add enpoint to hit before/after running tests
