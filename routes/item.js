
/*
 * items routes
 */
/*global exports, require, module */

var Account = require('./../model/account'),
	Book = require('./../model/book');

//app.get('/item');
exports.newBook = function (req, res, next) {
    "use strict";
    
    debugger;

    res.render('createbook', false /* not rendering from a successful create action */);
};

//app.post('/item');
exports.createBook = function (req, res, next) {
    "use strict";
    
    Book.newBook({
    	title: req.body.title,
    	author: req.body.author,
    	tags: req.body.tags, // TODO: parse string into array of strings
    	condition: req.body.condition,
    	grade: req.body.grade
    });
    
    res.redirect('createbook', true);
};

//app.get('/item/:itemid');
exports.action = function (req, res, next) {
    "use strict";
    
    /* if this book status is unactivated, activate it.
     * else if this book status is checked out, check it back in.
     * else if this book status is not checked out, check it out.
     */
    Book.findById(req.session.itemId, function (err, book) {
        if (err || !book) {return next(err); }
        var action,
        	user;

        if (!book.activated()) {
        	// this book is not activated yet. It is likely just added.
        	book = book.activate();
        	action = "activated";
        } else {
            Account.findById(book.borrowedBy, function (err, acct) {
                if (err || !acct) {return next(err); }
                user = acct;

                if (book.checkedOut()) {
                	// this book is checked out. Check it back in.
                	// checked out books can be checked in by anybody.

                	// add the event to the user history of the person who checked out the book
                	acct.checkedInItem(book);

                	book = book.checkIn(acct);
                	action = "checked in";
                } else {
                	// this book is not checked out. Check it out.

                	// add the event to the user history of the person who checked out the book
                	acct.checkedOutItem(book);

                    book = book.checkOut(acct);
                	action = "checked out";
                }
            });
        }
        
        res.render('itemhome', {item: book, acct: user, event: action});
    });
};

//app.post('/item/:itemid');
exports.update = function (req, res, next) {
	"use strict";
	
	// An item record is changed
	Book.findById(req.session.itemId, function (err,book) {
		if (err || !book) {return next(err);}
		
		Book.updateBook (req.session.itemId, req.body);
	});
};
