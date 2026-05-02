const mongoose = require('mongoose');

// Ez a sablon tárolja az előre megadott munkatípusokat
const taskTypeSchema = new mongoose.Schema({
  megnevezes: {
    type: String,
    required: true,
    unique: true, // Ne lehessen kétszer felvinni ugyanazt (pl. "Könyvelés")
    trim: true
  }
});

module.exports = mongoose.model('TaskType', taskTypeSchema);