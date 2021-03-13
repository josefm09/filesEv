'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Modelo de los analisis a los comentarios
 */
var AnalysisSchema = new Schema({
  idUsuario: {
    type: String,
    trim: true,
    required: true
  },
  result: {
    type: String,
    trim: true,
    required: true
  },
  polarity: {
    type: Number,
    trim: true,
    required: true
  },
  bestSentence: {
      type: String,
      trim: true,
      required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Analysis', AnalysisSchema);