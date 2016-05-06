'use strict';


var psi = require('psi');
var fs = require('fs');
var dateFormat = require('dateformat');
var now = new Date();



var _pages = [];

var _output = {};

var count = 0;

// for (var i = pages.length - 1; i >= 0; i--) {
//     var page = pages[i];

// }

function output(data) {

    // console.error( 'Page: ' + data.page );
    // console.log('Speed score: ' + data.data.ruleGroups.SPEED.score);
    // console.log('Usability score: ' + data.data.ruleGroups.USABILITY.score);

    console.log( data );

    //console.log( _output );
}

function collectScores(data) {

    //console.log( 'collectScores', data.strategy, data.page);

    if (typeof _output[data.page] === 'undefined') {
        _output[data.page] = {};
    }
    _output[data.page][data.strategy] = data.data;
    
    if ( typeof _output[data.page]['mobile'] !== 'undefined' && typeof _output[data.page]['desktop'] !== 'undefined') {
         //console.log( 'do next' );
         //console.log( _output );
         processArray();
    }
}

function getScore(page, callback) {
    getMobile(page, callback);
    getDesktop(page, callback);
}

function getMobile(page, callback) {
    getPsi(page, 'mobile', callback);
}
function getDesktop(page, callback) {
    getPsi(page, 'desktop', callback);
}

function getPsi(page, strategy, callback) {

    var options = { 
        key: 'AIzaSyCp27xVoThqHBfxdDvI-6m75XfJh5mDnCI',
        strategy: strategy
    }
    
    psi(page, options).then(function (data) {
        delete(data.formattedResults)
        callback({page: page, strategy: strategy, data: data})
    });
}

function writeFile(string) {
    var dt =  dateFormat(now, "yyyyddmm-hhMMss");
    var file = dt + '.json';
    fs.writeFile(file, string, function (err) {
        if (err) return console.log(err);
    });
}


function processArray() {
    if (_pages.length) {
        item = _pages.shift();
        console.log( item );
        getScore(item, collectScores);
    } else {

        console.log( 'All Done' );
        //console.log( _output );
        writeFile(JSON.stringify(_output));


    }
} 

_pages = pages;
processArray();
