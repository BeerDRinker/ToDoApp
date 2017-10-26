const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required:  true,  
        trim: true,
        unique:  true, 
        minlength: 1,
        validate: {
            isAsync: true,
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
          }
    },
    password: {
        type: String,
        required:  true,  
        minlength: 4
    },
    name: {
        type: String,
        required:  true,  
        minlength: 1
    },

});

UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);