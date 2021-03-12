'use strict';

var mongoose = require('mongoose'),
  File = mongoose.model('File');

exports.upload = function(req,res){
  var newText = new File(req.body);

  newText.idUsuario = req.user._id;
  newText.save(function(err, file) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {;
      return res.json(file);
    }
  });
};

exports.get = function(req,res){

  File.find({
    idUsuario: req.user._id
  }, function(err, files) {
    if (err) {
      return res.status(500).json({ message: err });
    }

    return res.json(files);
  });
};