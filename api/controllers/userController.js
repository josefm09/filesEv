'use strict';

var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcryptjs'),
  config = require('../config'),
  User = mongoose.model('User');

exports.register = function(req, res) {
  var newUser = new User(req.body);
  const saltRounds = 9;

  newUser.hash_password = bcrypt.hashSync(req.body.password, saltRounds);
  newUser.save(function(err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      user.hash_password = undefined;
      return res.json(user);
    }
  });
};

exports.sign_in = function(req, res) {
  const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@coppel.com$/);

  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) {
      return res.status(500).json({ message: err });
    }
    
    if (!user || !regex.test(user.email)){
      console.log(!regex.test(user.email));
      return res.status(401).json({ message: 'Correo no valido, solo se admite el ingreso con correos de la empresa (@coppel.com)!!' });
    } 
    if (!user.comparePassword(req.body.password)) {
      return res.status(401).json({ message: 'Fallo en la autenticacion. Usuario y contraseña no coinciden.' });
    }
    return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, config.SECRET) });
  });
};

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Usuario no autorizado!!' });
  }
};
exports.profile = function(req, res, next) {
  if (req.user) {
    res.send(req.user);
    next();
  } 
  else {
   return res.status(401).json({ message: 'Token invalido' });
  }
};