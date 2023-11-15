const Cita = require("../models/citaModel");

const getAllCitas = async (req, res) => {
  try {
    const citas = await Cita.findAll();
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCita = async (req, res) => {
  try {
    const nuevaCita = await Cita.create(req.body);
    res.status(201).json(nuevaCita);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCita = async (req, res) => {
  const { id } = req.params;

  try {
    // Utiliza el método update del modelo Cita con la cláusula where
    const [numRowsUpdated, updatedCitas] = await Cita.update(req.body, {
      where: { id: id },
      returning: true,
    });

    if (numRowsUpdated > 0) {
      res.status(200).json(updatedCitas[0]);
    } else {
      res.status(404).json({ error: "Cita no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCitas,
  createCita,
  updateCita,
};
