'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Modelo del archivo de texto
 */
var FileSchema = new Schema({
  idUsuario: {
    type: String,
    trim: true,
    required: true
  },
  fileText: {
    type: String,
    trim: true,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('File', FileSchema);