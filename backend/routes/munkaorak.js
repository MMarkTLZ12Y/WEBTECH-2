const express = require('express');
const router = express.Router();
const Munkaora = require('../models/Munkaora');

// 1. Új munkaóra rögzítése
router.post('/uj', async (req, res) => {
  try {
    const ujOra = new Munkaora({
      felhasznaloId: req.body.felhasznaloId,
      datum: req.body.datum,
      kezdes: req.body.kezdes,
      befejezes: req.body.befejezes,
      orakSzama: req.body.orakSzama,
      kategoria: req.body.kategoria, // <-- Bekerült
      leiras: req.body.leiras
    });
    const mentettOra = await ujOra.save();
    res.status(201).json(mentettOra);
  } catch (error) {
    res.status(500).json({ hiba: error.message });
  }
});

// 2. Egy felhasználó összes munkaórájának lekérése
router.get('/:felhasznaloId', async (req, res) => {
  try {
    const orak = await Munkaora.find({ felhasznaloId: req.params.felhasznaloId });
    res.status(200).json(orak);
  } catch (error) {
    res.status(500).json({ hiba: error.message });
  }
});

// 3. Munkaóra törlése
router.delete('/:id', async (req, res) => {
  try {
    const toroltOra = await Munkaora.findByIdAndDelete(req.params.id);
    if (!toroltOra) return res.status(404).json({ hiba: 'Nem található ilyen munkaóra!' });
    res.status(200).json({ uzenet: 'Munkaóra sikeresen törölve!' });
  } catch (error) {
    res.status(500).json({ hiba: error.message });
  }
});

// 4. Munkaóra módosítása
router.put('/:id', async (req, res) => {
  try {
    const frissitettOra = await Munkaora.findByIdAndUpdate(
      req.params.id, 
      {
        datum: req.body.datum,
        kezdes: req.body.kezdes,
        befejezes: req.body.befejezes,
        orakSzama: req.body.orakSzama,
        kategoria: req.body.kategoria, // <-- Bekerült
        leiras: req.body.leiras
      },
      { new: true } 
    );
    res.status(200).json(frissitettOra);
  } catch (error) {
    res.status(500).json({ hiba: error.message });
  }
});

module.exports = router;