var ss = require('./index.js');

var options = {
    output: 'example_',
    primer: true,
    googleKey: 'xxxxxxxx-xxxx'
}

var pages = [
    'http://www.lmo.com/',
    'https://github.com/',
    'https://www.google.com/',
]

ss.run(pages, options)
