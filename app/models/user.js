var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

    local            : {
        firstname    : String,
        lastname     : String,
        email        : String,
        password     : String,
        userid       : String,
        userColor    : String,
        description  : String,
        github       : String,
        projects : [
            {
                projectkey : String,
                projectid  : String

            }

        ]
    }
});

// This generates hash for newly created passwords
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check if password matches
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
