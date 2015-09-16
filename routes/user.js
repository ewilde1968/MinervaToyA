
/*
 * users routes
 */
/*global exports, require, module */

var Account = require('./../model/account');

//app.use( function(q,r,n) {user.ensureSignedIn(q,r,n);});
exports.ensureSignedIn = function (req, res, next) {
    "use strict";
    // make sure the user is signed in and, if not, redirect to login page
    if (req.session.userId) {
        next(); // TODO: use something more secure to ensure signin legitimate
    } else {
        res.redirect('/');
    }
};

//app.get('/user/new', user.newUser);
exports.newUser = function (req, res, next) {
    "use strict";
    res.render('createaccount', {err: false});
};

//app.post('/user/new', user.createUser);
exports.createUser = function (req, res, next) {
    "use strict";
    Account.newAccount(req.body.username, req.body.password, function (err, acct) {
        if (err) {return next(err); }

        if (acct) {
            // sign in
            req.session.userId = acct.id;    // TODO: use something more secure

            // show user page
            res.redirect('/user/' + req.session.userId);
        } else {
            // duplicate user or invalid password
            res.render('createaccount', {err: true});
        }
    });
};

//app.post('/user/:userid', user.update);
exports.update = function (req, res, next) {
    "use strict";
    Account.updateAccount(req.session.userId, req.body.username, req.body.password);
    res.redirect('/user/' + req.session.userId);
};

//app.get('/user/:userid', user.home);
exports.home = function (req, res, next) {
    "use strict";
    Account.findById(req.session.userId, function (err, acct) {
        if (err || !acct) {return next(err); }

        res.render('userhome', {user: acct});
    });
};