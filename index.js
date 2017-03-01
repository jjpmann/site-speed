'use strict';

var psi = require('psi');
var ylt = require('yellowlabtools');
var fs = require('fs');
var dateFormat = require('dateformat');

// for (var i = pages.length - 1; i >= 0; i--) {
//     var page = pages[i];

// }

var SS = function () {}

SS.prototype.run = function(pages, opts) {

    // defaults
    var defaults = {
        output: './data/',
        primer: false,
        before: false,
        after: false
    }

    var opts = Object.assign(defaults, opts || {});

    if (!opts.googleKey) {
        console.log( 'Warning using Googles API without a key will have limitations.' );
    }

    var now = new Date(),
        _pages = [],
        _output = {},
        count = 0;

    function showError(err) {
        console.error('Error: ', err );
        return;
    }

    function collectScores(data) {

        // Todo: Clean up this process 

        if (typeof _output[data.page] === 'undefined') {
            _output[data.page] = {};
        }
        if (typeof _output[data.page][data.strategy]  === 'undefined') {
            _output[data.page][data.strategy] = {};
        }
        _output[data.page][data.strategy][data.type] = data.data;
        
        if ( typeof _output[data.page]['mobile'] !== 'undefined' && (
                typeof _output[data.page]['mobile']['Pagespeed Insights'] !== 'undefined' 
                && typeof _output[data.page]['mobile']['Yellowlab Tools'] !== 'undefined' )
             && typeof _output[data.page]['desktop'] !== 'undefined' && (
                typeof _output[data.page]['desktop']['Pagespeed Insights'] !== 'undefined'
                && typeof _output[data.page]['desktop']['Yellowlab Tools'] !== 'undefined') ){
             //console.log( 'do next' );
             //console.log( _output );
             processArray();
        }
    }

    function prime(page, callback) {
        var url = require('url').parse(page);

        var options = {
            hostname: url.hostname,
            protocol: url.protocol,
            path: url.path
        }

        var http = url.protocol === 'https:' ? require('https') : require('http');

        var req = http.request(options, (res) => {
            console.log(`Prime (STATUS: ${res.statusCode})`);
            res.on('data', (chunk) => {});
            res.on('end', () => {
                getMobile(page, callback);
                getDesktop(page, callback);
            })
        });

        req.on('error', (e) => {
            showError(`problem with request: ${e.message}`);
        });

        req.end();
    }

    function getScore(page, callback) {
        console.log( page );
        if (opts.primer) {
            prime(page, callback)
            return
        } else {
            getMobile(page, callback);
            getDesktop(page, callback);
        }
    }

    function getMobile(page, callback) {
        getPsi(page, 'mobile', callback);
        getYlt(page, 'mobile', callback);
    }

    function getDesktop(page, callback) {
        getPsi(page, 'desktop', callback);
        getYlt(page, 'desktop', callback);
    }

    function getYlt(page, strategy, callback){

        var options = {
            device: strategy
        };

        try {
            ylt(page, options)
                .then(function(data) {
                    callback({page: page, strategy: strategy, data: data, type: 'Yellowlab Tools'})
                })
                .fail(function(reason) {
                    showError(reason);
                });
        }
        catch(err) {
            showError(err);
        }

       

    }

    function getPsi(page, strategy, callback) {
        var options = { 
            strategy: strategy
        }

        if (opts.googleKey) {
            options.key = opts.googleKey
        }

        try {
            var call = psi(page, options).then(function (data) {
                delete(data.formattedResults)
                callback({page: page, strategy: strategy, data: data, type: 'Pagespeed Insights'})
            }, function(reason){
                showError(reason);
            });
        }
        catch(err) {
            showError(err);
        }
    }

    function writeFile(string) {
        var dt =  dateFormat(now, "yyyymmdd-hhMMss");
        var file =  opts.output + dt + '.json';

        fs.writeFile(file, string, function (err) {
            if (err) return showError(err);
        });

        console.log( 'All Done: file saved as '+ file );
    }

    function processArray(pages) {

        if (typeof pages != 'undefined') {
            _pages = pages
        }

        if (_pages.length) {
            var item = _pages.shift();
            //console.log( item );
            getScore(item, collectScores);
        } else {
            //console.log( _output );
            writeFile(JSON.stringify(_output));
        }
    } 

    return processArray(pages);
};



module.exports = new SS();

