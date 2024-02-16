require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const app = express();
app.disable("x-powered-by");
const userRoutes = require("./Routes/user.router");
const patientRoutes = require("./Routes/patient.router");
const medicineRoutes = require("./Routes/medicine.router");
const diseaseRoutes = require("./Routes/disease.router");
const nurseTaskRoutes = require("./Routes/nurseTask.router");
const prescriptionRoutes = require("./Routes/prescription.router");
const cors = require("cors");

//Database Connection
const mongoose = require("mongoose");
const morgan = require("morgan");

app.use(
  (req, res, next) =>
    new Promise((resolve) => {
      setTimeout(() => {
        next();
      }, 700);
    })
);

mongoose
  .connect("mongodb://localhost:27017/Healthcare")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could'd not connect", err));

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//ROUTES
app.use("/user", userRoutes);
app.use("/patient", patientRoutes);
app.use("/medicine", medicineRoutes);
app.use("/disease", diseaseRoutes);
app.use("/nurse-task", nurseTaskRoutes);
app.use("/prescription", prescriptionRoutes);

//Route NOT Found
app.use((req, res, next) => {
  res.status(404).send("Route Not Found");
});

//Error Handler
app.use((error, req, res, next) => {
  console.log(error);
  // Error gets here
  res.status(500).json({
    message: error.message,
    error,
  });
});

//Server Running on PORT
app.listen(PORT || 8080, () => {
  console.log(`Server is running on port ${PORT}...`);
});
