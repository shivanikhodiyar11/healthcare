const router = require("express").Router();
const medicineController = require("../controllers/medicine.controller");
const authentication = require("../middlewares/authentication");
const authorizeRole = require("../middlewares/authorization");

router.use(authentication);

//Add Medicine
router.post("/", authorizeRole(["Admin"]), medicineController.addMedicine);

// Get All Medicines
router.get(
  "/",
  authorizeRole(["Admin", "Doctor"]),
  medicineController.getMedicines
);

//Get Medicine By ID
router.get(
  "/:id",
  authorizeRole(["Admin", "Doctor"]),
  medicineController.getMedicineById
);

// Update Medicine By ID
router.put(
  "/update/:id",
  authorizeRole(["Admin", "Doctor"]),
  medicineController.updateMedicineById
);

// Delete Medicine By ID
router.delete(
  "/delete/:id",
  authorizeRole(["Admin", "Doctor"]),
  medicineController.deleteMedicineById
);

module.exports = router;
