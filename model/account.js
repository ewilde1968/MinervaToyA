/*
 * User model
*/
/*global export, require, module */

var Account; // forward to clear out JSLint errors

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var AccountSchema = new Schema({
    first:          String,
    last:           String,
    email:          { type: String, unique: true, required: true },
    password:       { type: String, required: false },  // TODO: for the moment, assume minimal security is required
    history:		[{ book: ObjectId, borrowed: Date, returned: Date}],
    canBorrow:		{ type: Boolean, required: true },
    admin:          Boolean
});


AccountSchema.statics.newAccount = function (username, password, cb) {
    "use strict";
    Account.findOne({email: username}, function (err, doc) {
        if (err) {return err; }
        if (!doc) {
            // assume logged in appropriately by this point
            var acct = new Account({email: username, password: password, canBorrow: true});
            if (acct) {
                acct.save(cb);
            } else {
                throw {
                    name: "new Account failed",
                    message: "Account.updateAccount"
                };
            }
        } else {
            if (cb) {cb(0); }
        }
    });
};

AccountSchema.statics.updateAccount = function (userId, username, password) {
    "use strict";
    // assume logged in appropriately by this point
    var acct = Account.findByIdAndUpdate(userId,
                                         {email: username, password: password}
                                        ).exec();
    
    return acct;
};

AccountSchema.statics.login = function (username, password, cb) {
    "use strict";
    var acct = Account.findOne({email: username, password: password}, cb);
    
    return acct;
};

Account = mongoose.model('Account', AccountSchema);
module.exports = Account;
