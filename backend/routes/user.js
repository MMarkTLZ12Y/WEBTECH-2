const express = require('express');
const router = express.Router();
const User = require('../models/User');

// BEJELENTKEZÉS
router.post('/login', async (req, res) => {
  try {
    const felhasznalo = await User.findOne({ email: req.body.email.toLowerCase() });
    
    if (!felhasznalo) {
      return res.status(404).json({ hiba: 'Nincs ilyen felhasználó!' });
    }
    
    if (felhasznalo.jelszo !== req.body.jelszo) {
      return res.status(400).json({ hiba: 'Hibás jelszó!' });
    }
    
    // Virtuális mezők aktiválása a válaszban
    const userAdat = felhasznalo.toObject({ virtuals: true });
    userAdat.isAdmin = felhasznalo.szerepkor === 'admin';

    res.status(200).json({ 
      uzenet: '✅ Sikeres bejelentkezés!', 
      user: userAdat 
    });
  } catch (error) {
    res.status(500).json({ hiba: error.message });
  }
});

// ÚJ DOLGOZÓ LÉTREHOZÁSA (Admin által)
router.post('/uj', async (req, res) => {
  try {
    const ujDolgozo = new User({
      nev: req.body.nev,
      email: req.body.email,
      jelszo: req.body.jelszo,
      szerepkor: 'dolgozó'
    });
    const mentett = await ujDolgozo.save();
    res.status(201).json({ uzenet: '✅ Sikeres mentés!', dolgozo: mentett });
  } catch (error) {
    res.status(400).json({ hiba: error.message });
  }
});

module.exports = router;