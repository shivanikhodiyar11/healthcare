const router = require("express").Router();
const diseaseController = require("../controllers/disease.controller");
const authentication = require("../middlewares/authentication");
const authorizeRole = require("../middlewares/authorization");

router.use(authentication);
//Add Disease
router.post("/", authorizeRole(["Admin"]), diseaseController.addDisease);

// Get All Diseases
router.get(
  "/",
  authorizeRole(["Admin", "Doctor"]),
  diseaseController.getDiseases
);

//Get Disease By ID
router.get(
  "/:id",
  authorizeRole(["Admin", "Doctor"]),
  diseaseController.getDiseaseById
);

// Update Disease By ID
router.put(
  "/update/:id",
  authorizeRole(["Admin", "Doctor"]),
  diseaseController.updateDiseaseById
);

// Delete Disease By ID
router.delete(
  "/delete/:id",
  authorizeRole(["Admin", "Doctor"]),
  diseaseController.deleteDiseaseById
);

module.exports = router;
