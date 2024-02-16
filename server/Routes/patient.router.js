const router = require("express").Router();
const patientController = require("../controllers/patient.controller");
const authentication = require("../middlewares/authentication");
const authorizeRole = require("../middlewares/authorization");

router.use(authentication);
//Add Patient
router.post(
  "/",
  authorizeRole(["Nurse", "Admin", "Doctor"]),
  patientController.addPatient
);

// Get All Patients
router.get(
  "/",
  authorizeRole(["Doctor", "Admin", "Nurse"]),
  patientController.getPatients
);

//Get Patient By ID
router.get(
  "/:id",
  authorizeRole(["Doctor", "Admin", "Nurse"]),
  patientController.getPatientById
);

// Update Patient By ID
router.put(
  "/update/:id",
  authorizeRole(["Admin", "Nurse"]),
  patientController.updatePatientById
);

// Delete Patient By ID
router.delete(
  "/delete/:id",
  authorizeRole(["Admin", "Nurse"]),
  patientController.deletePatientById
);

module.exports = router;
