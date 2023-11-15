const express = require("express");
const router = express.Router();
const citasController = require("../controllers/citasController");

router.get("/", citasController.getAllCitas);
router.post("/", citasController.createCita);

module.exports = router;
