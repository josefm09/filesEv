'use strict';

const config = require('./config');

var express = require('express'),
  app = express(),
  port = config.PORT,
  cors = require('cors'),

  User = require('./models/userModel'),
  File = require('./models/fileModel'),
  bodyParser = require('body-parser'),
  jsonwebtoken = require("jsonwebtoken");

const mongoose = require('mongoose');

app.use(cors());
app.options('*', cors());

const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};

const mongoURI = config.MONGODB_URI;
mongoose.connect(mongoURI, option).then(function(){
    //connected successfully
}, function(err) {
    console.log(err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.SECRET, function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});
var routes = require('./route/routes');
routes(app);

app.use(function(req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port);

console.log(' RESTful API server started on: ' + port);

module.exports = app;