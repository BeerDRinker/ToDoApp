const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 1
    },
    hash_password: {
        type: String,
        required: true,
        minlength: 4
    },
    name: {
        type: String,
        required: true,
        minlength: 1
    },

});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.hash_password);
};

module.exports = mongoose.model('User', UserSchema);