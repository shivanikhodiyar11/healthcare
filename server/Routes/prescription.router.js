const router = require("express").Router();
const prescriptionController = require("../controllers/prescription.controller");
const authentication = require("../middlewares/authentication");
const authorizeRole = require("../middlewares/authorization");

router.use(authentication);
//Add Prescription
router.post(
  "/",
  authorizeRole(["Admin", "Doctor"]),
  prescriptionController.addPrescription
);

// Get All Prescriptions
router.get("/", prescriptionController.getPrescriptions);

//Get Prescription By ID
router.get(
  "/:patientId",
  authorizeRole(["Admin", "Doctor"]),
  prescriptionController.getPrescriptionByPatientId
);

// Update Prescription By ID
router.put(
  "/update/:id",
  authorizeRole(["Admin", "Doctor"]),
  prescriptionController.updatePrescriptionById
);

// Update Prescription Medicine By ID
router.put("/medicine/:id", prescriptionController.updatePrescriptionMedicine);

// Update Prescription Medicine By ID
router.put("/disease/:id", prescriptionController.updatePrescriptionDisease);

// Delete Prescription By ID
router.delete(
  "/delete/:id",
  authorizeRole(["Admin", "Doctor"]),
  prescriptionController.deletePrescriptionById
);

module.exports = router;
