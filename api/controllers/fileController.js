'use strict';

var mongoose = require('mongoose'),
  File = mongoose.model('File'),
  Analysis = mongoose.model('Analysis'),
  axios = require('axios');

exports.upload = function(req,res){
  var newText = new File(req.body);

  newText.idUsuario = req.user._id;
  newText.save(function(err, file) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {;
      analyze(file.fileText,req.user._id,res);
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

exports.getAnalysis = function(req,res){

  Analysis.find({
    idUsuario: req.user._id
  }, function(err, analysis) {
    if (err) {
      return res.status(500).json({ message: err });
    }

    return res.json(analysis);
  });
};

function analyze(text,userId,response){

  axios
  .post('https://sentim-api.herokuapp.com/api/v1/', {
    text: text
  })
  .then(res => {
    var n = -1;
    var bestSentence = "";
    res.data.sentences.forEach(element => {
      if(element.sentiment.polarity > n){
        n = element.sentiment.polarity;
        bestSentence = element.sentence;
      }
    });

    const analysisBody = {
      idUsuario: userId,
      result: res.data.result.type,
      polarity: res.data.result.polarity,
      bestSentence: bestSentence
    };

    var newAnalysis = new Analysis(analysisBody);

    newAnalysis.save(function(err, analysis) {
      if (err) {
        return response.status(400).send({
          message: err
        });
      } else {
        console.log('Analizado correctamente');
      }
    });
  })
  .catch(error => {
    console.error(error)
  })
}