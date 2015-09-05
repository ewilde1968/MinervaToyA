/**
 * Module dependencies.
 */
/*global exports, require, module, process, __dirname, console */

/* setup also requires:
   npm install mongoose
   npm install jade
   */

var express = require('express'),  // npm install express
    favicon = require('express-favicon'),  // npm install express-favicon
    logger = require('express-logger'),  // npm install express-logger
    parser = require('body-parser'),  // npm install body-parser
    methodOverride = require('express-method-override'), // npm install express-method-override
    cookieParser = require('cookie-parser'),  // npm install cookie-parser
    session = require('express-session'), // npm install express-session
    errH = require('express-error-handler'), // npm install express-error-handler
    http = require('http'),
    path = require('path'),
    util = require('util'),
    app = express(),
    routes = require('./routes'),
//  user = require('./routes/user'),
//  book = require('./routes/book'),
    database = require('./model/database'),
    dn = __dirname,
    logRequest = function (req, res, next) {
        "use strict";
        if (req && 'POST' === req.method) {
            if (req.params) {console.log("Request Params: ", util.inspect(req.params, {depth: 4, colors: true})); }
            if (req.body) {console.log("Request Body: ", util.inspect(req.body, {depth: 4, colors: true})); }
        }

        next();
    };

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', dn + '/views');
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger({ path: './dev'}));
//app.use(parser.json());
app.use(parser.urlencoded({extended:true}));
app.use(logRequest);
app.use(methodOverride());
app.use(cookieParser('minervaCookieSecret'));
app.use(session({ secret: 'minervaSessionSecret', resave: false, saveUninitialized: false}));
// app.use(app.router);  // deprecated, do I need to use Router constructor?
app.use(express.static(path.join(dn, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(errH({ server: app}));
}

app.get('/', routes.index);
app.post('/', routes.signin);
/*app.get('/user/new', user.newUser);
app.post('/user/new', user.createUser);
app.get('/user/:userid', user.ensureSignedIn, user.home);
app.post('/user/:userid', user.ensureSignedIn, user.update);
app.get('/user/:userid/book/new', user.ensureSignedIn, book.newBook);
app.post('/user/:userid/book/new', user.ensureSignedIn, book.createBook);
app.get('/user/:userid/book/:bookid', user.ensureSignedIn, book.home);
app.post('/user/:userid/book/:bookid', user.ensureSignedIn, book.update);
*/
// setup DB
app.database = database('minerva').initialize();

http.createServer(app).listen(app.get('port'), function () {
    "use strict";
    console.log('Express server listening on port ' + app.get('port'));
});
