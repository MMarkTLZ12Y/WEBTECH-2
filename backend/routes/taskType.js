const express = require('express');
const router = express.Router();
const TaskType = require('../models/TaskType');

// Új kategória létrehozása
router.post('/uj', async (req, res) => {
  try {
    const ujKategoria = new TaskType({ megnevezes: req.body.megnevezes });
    const mentettKategoria = await ujKategoria.save();
    res.status(201).json({ uzenet: '✅ Kategória elmentve!', kategoria: mentettKategoria });
  } catch (error) {
    res.status(400).json({ hiba: error.message });
  }
});

// Összes kategória lekérdezése
router.get('/osszes', async (req, res) => {
  try {
    const kategoriak = await TaskType.find();
    res.status(200).json(kategoriak);
  } catch (error) {
    res.status(500).json({ hiba: error.message });
  }
});

module.exports = router;