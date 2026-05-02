const mongoose = require('mongoose');

const munkaoraSchema = new mongoose.Schema({
  felhasznaloId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datum: { type: Date, required: true },
  kezdes: { type: String },    
  befejezes: { type: String }, 
  orakSzama: { type: Number, required: true },
  kategoria: { type: String, required: true }, // <-- ÚJ: Kötelező kategória
  leiras: { type: String }                     // <-- VÁLTOZÁS: Már nem required (nem kötelező)
});

module.exports = mongoose.model('Munkaora', munkaoraSchema);
