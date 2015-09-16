/*
 * User model
*/
/*global export, require, module */

var Book; // forward to clear out JSLint errors

var mongoose = require('mongoose'),
	Account = require('./account'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var BookSchema = new Schema({
	title:			{ type: String, required: true },
	author:			String,
	tags:			[ String ],
	condition:		String,
	grade:			String,
    canBorrow:		{ type: Boolean, required: true },
    borrowedBy:		ObjectId
});


BookSchema.statics.newBook = function (options, cb) {
    "use strict";
    // assume logged in appropriately by this point

    if (!options || !options.title) {
    	throw {
    		name: "newBook failed",
    		message: "newBook does not have options or title object"
    	}
    }
    
    var book = new Book({
    	title: options.title,
    	author: options.author,
    	tags: options.tags,
    	condition: options.condition,
    	grade: options.grade,
    	canBorrow: false});
    
    if (book) {
    	book.save(cb);
    } else {
    	throw {
    		name: "newBook failed",
    		message: "could not create book object in database"
    	}
    }
};

BookSchema.statics.updateBook = function (bookId, options) {
    "use strict";
    // assume logged in appropriately by this point
    var book = Book.findByIdAndUpdate(bookId, options).exec();
    
    return book;
};

BookSchema.activate = function () {
	"use strict";
	
	// to be called when a book has been entered and that book's QR code was referenced
	// used to test the QR code association with the book.
	// checkouts are enabled after an item is activated.
	this.updateBook( this._id, { canBorrow: true});
	
	return this;
};

BookSchema.activated = function () {
	"use strict";
	
	return this.canBorrow;
};

BookSchema.checkedOut = function () {
	"use strict";
	
	return this.borrowedBy;
};

BookSchema.checkOut = function (acct) {
	"use strict";
	
	if (acct.canBorrow && this.canBorrow) {
		// borrow is possible
		this.updateBook( this._id, { borrowedBy: acct._id});
	}
	
	return this;
};

BookSchema.checkIn = function (acct) {
	"use strict";
	
	if (acct._id !== this.borrowedBy) {
		throw {
			name: "BookSchema.checkIn failed",
			message: "acct._id does not equal book.borrowedBy"
		};
	}
	
	this.updateBook( this._id, {borrowedBy: null});
	
	return this;
};

Book = mongoose.model('Book', BookSchema);
module.exports = Book;
