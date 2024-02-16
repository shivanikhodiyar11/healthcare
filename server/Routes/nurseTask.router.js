const router = require("express").Router();
const taskController = require("../controllers/nurseTask.controller");
const authentication = require("../middlewares/authentication");
const authorizeRole = require("../middlewares/authorization");

router.use(authentication);

//Add NurseTask
router.post("/", authorizeRole(["Doctor", "Admin"]), taskController.addTask);

// Get All NurseTasks
router.get(
  "/",
  authorizeRole(["Nurse", "Admin", "Doctor"]),
  taskController.getTasks
);

//Get NurseTask By ID
router.get(
  "/:patientId",
  authorizeRole(["Nurse", "Admin", "Doctor"]),
  taskController.getTaskByPatientId
);

// Update NurseTask By ID
router.put(
  "/update/:id",
  authorizeRole(["Nurse", "Admin", "Doctor"]),
  taskController.updateTaskById
);

// Delete NurseTask By ID
router.delete(
  "/delete/:id",
  authorizeRole(["Admin", "Doctor"]),
  taskController.deleteTaskById
);

module.exports = router;
