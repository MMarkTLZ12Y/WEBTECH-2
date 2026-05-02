const express = require('express');
const router = express.Router();
const TimeLog = require('../models/TimeLog');

// Új munkaóra bejegyzés létrehozása
router.post('/uj', async (req, res) => {
  try {
    const ujBejegyzes = new TimeLog({
      munkatars: req.body.munkatars, // Ide majd egy User ID jön
      kategoria: req.body.kategoria, // Ide majd egy TaskType ID jön
      datum: req.body.datum,
      kezdes: req.body.kezdes,
      befejezes: req.body.befejezes,
      szunetPerc: req.body.szunetPerc,
      megjegyzes: req.body.megjegyzes
    });
    const mentettBejegyzes = await ujBejegyzes.save();
    res.status(201).json({ uzenet: '✅ Munkaóra rögzítve!', bejegyzes: mentettBejegyzes });
  } catch (error) {
    res.status(400).json({ hiba: error.message });
  }
});

// Összes munkaóra lekérdezése (részletes adatokkal)
router.get('/osszes', async (req, res) => {
  try {
    // A populate() kicseréli az ID-kat a tényleges adatokra
    const bejegyzesek = await TimeLog.find()
      .populate('munkatars', 'nev email') 
      .populate('kategoria', 'megnevezes');
      
    res.status(200).json(bejegyzesek);
  } catch (error) {
    res.status(500).json({ hiba: error.message });
  }
});

module.exports = router;