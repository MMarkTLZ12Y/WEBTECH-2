const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Munkaora = require('../models/Munkaora');

router.get('/statisztikak', async (req, res) => {
  try {
    // Beérkező dátum kezelése (vagy a mai nap)
    let alapDatum;
    if (req.query.datum) {
      // "YYYY-MM-DD" formátum esetén éjfélt állítunk be
      alapDatum = new Date(req.query.datum);
    } else {
      alapDatum = new Date();
    }

    const dolgozok = await User.find({ szerepkor: 'dolgozó' }).select('nev email szerepkor uzenet');
    const mindenOra = await Munkaora.find().sort({ datum: -1 });

    // Hétfő kiszámítása (Helyi idő alapján)
    const d = new Date(alapDatum);
    const napIndex = d.getDay() === 0 ? 7 : d.getDay();
    const hetfo = new Date(d);
    hetfo.setDate(d.getDate() - napIndex + 1);
    hetfo.setHours(0, 0, 0, 0);

    // Vasárnap vége (23:59:59)
    const vasarnap = new Date(hetfo);
    vasarnap.setDate(hetfo.getDate() + 6);
    vasarnap.setHours(23, 59, 59, 999);

    const eredmeny = dolgozok.map(user => {
      const userOrai = mindenOra.filter(ora => ora.felhasznaloId.toString() === user._id.toString());
      
      // Teljes élettartam összesen
      const osszesen = userOrai.reduce((sum, ora) => sum + ora.orakSzama, 0);
      
      // Csak az adott hét bejegyzései
      const eHetiBejegyzesek = userOrai.filter(ora => {
        const oraDatum = new Date(ora.datum);
        return oraDatum >= hetfo && oraDatum <= vasarnap;
      });

      const hetiOsszeg = eHetiBejegyzesek.reduce((sum, ora) => sum + ora.orakSzama, 0);

      return {
        _id: user._id,
        nev: user.nev,
        email: user.email,
        heti: hetiOsszeg,
        osszes: osszesen,
        reszletek: eHetiBejegyzesek,
        uzenet: user.uzenet || ''
      };
    });

    res.status(200).json({ 
      adatok: eredmeny, 
      idoszak: { kezdet: hetfo, vege: vasarnap } 
    });
  } catch (error) {
    console.error("Admin statisztika hiba:", error);
    res.status(500).json({ hiba: 'Szerver hiba.' });
  }
});

// Üzenet küldése útvonal
router.put('/felhasznalo/:id/uzenet', async (req, res) => {
    try {
      const { uzenet } = req.body;
      await User.findByIdAndUpdate(req.params.id, { uzenet: uzenet });
      res.status(200).json({ üzenet: 'Üzenet elmentve!' });
    } catch (error) {
      res.status(500).json({ hiba: 'Szerver hiba az üzenet mentésekor.' });
    }
});

// Törlés útvonal
router.delete('/felhasznalo/:id', async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      await Munkaora.deleteMany({ felhasznaloId: req.params.id });
      res.status(200).json({ üzenet: 'Törölve!' });
    } catch (error) {
      res.status(500).json({ hiba: 'Hiba a törlés során.' });
    }
});

module.exports = router;
