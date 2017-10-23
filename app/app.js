const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('./config/config');
const User = require('./models/user');

const app = express();

mongoose.Promise = global.Promise;

mongoose.connect(config.dataBase.users, {
        useMongoClient: true
    })
    .then(() => console.log('Connected to DB succesfuly...'))
    .catch((err) => console.error(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


app.use(logger('dev'));


app.get('/api', function api(req, res) {
    res.json({
        description: 'My API. Please authenticate!'
    });
});

// ****************************************************************
// ******************  Register new User *************************
// ****************************************************************

app.post('/api/register', function (req, res) {

    const hash_password = bcrypt.hashSync(req.body.password, 8);

    User.create({
        email: req.body.email,
        hash_password: hash_password,
        name: req.body.name
    }, function (err, user) {

        if (err) {
            return res.status(400).send("There was a problem registering the user.")
        }

        let token = jwt.sign({
            id: user._id
        }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(201).send({
            auth: true,
            token: token
        });
    });
});

// ****************************************************************
// **********************  Login User *****************************
// ****************************************************************

app.post('/api/login', (req, res) => {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {
            if (User.comparePassword(req.body.password)) {  /////  <<<<==== зупинився на  зрывнянні і шифруванні паролів
                res.status(401).json({
                    success: false,
                    message: 'Authentication failed. Wrong Password.'
                });
            } else {
                return res.status(200).json({
                    token: jwt.sign({
                        email: user.email,
                        name: user.name,
                        _id: user._id
                    }, config.secret)
                });
            }
        }
    });
});


// app.post('/api/login', (req, res) => {

//     // insert code here to actually authenticate, or fake it
//     const user = {
//         id: 3
//     };

//     // then return a token, secret key should be an env variable
//     const token = jwt.sign({
//         user: user.id
//     }, 'secret_key_goes_here');
//     res.json({
//         message: 'Authenticated! Use this token in the "Authorization" header',
//         token: token
//     });
// });

module.exports = app;