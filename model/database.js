
/*
 * Database mdoel
 */
/*global export, require, module */

var Database; // forward to clear out JSLint errors


var mongoose = require('mongoose');

var connected = false;
var database = function (databaseName) {
    "use strict";
    var connected,
        that = {};

    if (!connected) {
        mongoose.connect('mongodb://127.0.0.1/' + databaseName);
    }
    connected = true;
    
    that.initialize = function () {
        // See if the database is setup properly and, if not, initialize.
        return that;
    };
    
    return that;
};

module.exports = database;