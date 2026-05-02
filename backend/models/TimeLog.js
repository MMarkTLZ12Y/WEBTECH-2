const mongoose = require('mongoose');

const timeLogSchema = new mongoose.Schema({
  // Hivatkozás a User modellre (Ki végezte a munkát?)
  munkatars: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Hivatkozás a TaskType modellre (Milyen típusú munka volt?)
  kategoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskType',
    required: true
  },
  datum: {
    type: Date,
    required: true,
    default: Date.now // Ha nem adunk meg dátumot, az aktuális napot veszi
  },
  kezdes: {
    type: String, 
    required: true // pl. "08:00"
  },
  befejezes: {
    type: String,
    required: true // pl. "16:30"
  },
  szunetPerc: {
    type: Number,
    default: 0 // pl. 30 perc ebédszünet
  },
  megjegyzes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // Mikor rögzítették a rendszerben
});

module.exports = mongoose.model('TimeLog', timeLogSchema);