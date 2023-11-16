const Cita = require("../models/citaModel");

const getAllCitas = async (req, res) => {
  try {
    const citas = await Cita.findAll();
    res.status(200).json({
      success: true,
      message: "Citas obtenidas con éxito.",
      data: citas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las citas.",
      error: error.message,
    });
  }
};

const createCita = async (req, res) => {
  try {
    const nuevaCita = await Cita.create(req.body);
    res.status(201).json({
      success: true,
      message: "Cita registrada con éxito.",
      data: nuevaCita,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al registrar la cita.",
      error: error.message,
    });
  }
};

const updateCita = async (req, res) => {
  const { id } = req.params;

  try {
    const [numRowsUpdated, updatedCitas] = await Cita.update(req.body, {
      where: { id: id },
      returning: true,
    });

    if (numRowsUpdated > 0) {
      res.status(200).json({
        success: true,
        message: "Cita modificada con éxito.",
        data: updatedCitas[0],
      });
    } else {
      res.status(404).json({ success: false, message: "Cita no encontrada." });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al modificar la cita.",
      error: error.message,
    });
  }
};

const deleteCita = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRowsCount = await Cita.destroy({
      where: { id: id },
    });

    if (deletedRowsCount > 0) {
      res.status(200).json({
        success: true,
        message: "Cita eliminada con éxito.",
      });
    } else {
      res.status(404).json({ success: false, message: "Cita no encontrada." });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar la cita.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCitas,
  createCita,
  updateCita,
  deleteCita,
};
