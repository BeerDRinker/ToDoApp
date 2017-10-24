const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 1
    },
    password: {
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

UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);