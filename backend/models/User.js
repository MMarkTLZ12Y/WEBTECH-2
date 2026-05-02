const mongoose = require('mongoose');

// Létrehozzuk a Munkatárs sémáját
const userSchema = new mongoose.Schema({
  nev: {
    type: String,
    required: true,
    trim: true 
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
    lowercase: true 
  },
  jelszo: {
    type: String,
    required: true
  },
  szerepkor: {
    type: String,
    enum: ['dolgozó', 'admin'], 
    default: 'dolgozó' 
  },
  // ÚJ: Itt tároljuk az admin üzenetét a dolgozónak
  uzenet: {
    type: String,
    default: ''
  }
}, {
  timestamps: true, 
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true }
});

// Virtuális 'isAdmin' mező a könnyebb kezelhetőségért
userSchema.virtual('isAdmin').get(function() {
  return this.szerepkor === 'admin';
});

// Exportáljuk a modellt
module.exports = mongoose.model('User', userSchema);