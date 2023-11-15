const express = require("express");
const citasController = require("../controllers/citasController");
const router = express.Router();

router.get("/", citasController.getAllCitas);
router.post("/", citasController.createCita);
router.put("/:id", citasController.updateCita);

module.exports = router;
