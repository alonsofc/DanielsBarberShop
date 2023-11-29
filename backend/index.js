const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./db");
const citasRoutes = require("./routes/citasRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/citas", citasRoutes);

sequelize
  .sync({ alter: true }) // Cambiar force a `true` para re-crear las tablas en cada reinicio (solo para desarrollo)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
