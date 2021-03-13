'use strict';

var mongoose = require('mongoose'),
  File = mongoose.model('File'),
  Analysis = mongoose.model('Analysis'),
  https = require('https');

const sentim = {
  hostname: 'sentim-api.herokuapp.com',
  port: 443,
  path: '/api/v1/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

exports.upload = function(req,res){
  var newText = new File(req.body);

  newText.idUsuario = req.user._id;
  newText.save(function(err, file) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {;
      analyze(file.fileText.fileText,req.user._id);
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

function analyze(text,userId){
  const data = JSON.stringify({
    text: text
  });

  const req = https.request(sentim, res => {
    console.log(`statusCode: ${res.statusCode}`);
  
    console.log(res);
    res.on('data', d => {
      var n = -1;
      var bestSentence = "";
      d.sentences.forEach(element => {
        if(element.polarity > n){
          n = element.polarity;
          bestSentence = element.sentence;
        }
      });

      const analysisBody = JSON.stringify({
        idUsuario: userId,
        result: d.result.type,
        polarity: d.result.polarity,
        bestSentence: bestSentence
      });

      var newAnalysis = new Analysis(analysisBody);

      newAnalysis.save(function(err, analysis) {
        if (err) {
          return res.status(400).send({
            message: err
          });
        } else {
          console.log('Analizado correctamente');
          return res.json(analysis);
        }
      });
    });
  });
  
  req.on('error', error => {
    console.error(error);
  });
  
  req.write(data);
  req.end();
}