const router = require("express").Router();
const userController = require("../controllers/user.controller");
const tokenController = require("../controllers/token.controller");

const authentication = require("../middlewares/authentication");
const authorizeRole = require("../middlewares/authorization");

// Create New User
router.post("/register", userController.addUser);

// Verify Token
router.get("/token/verify", tokenController.verifyToken, (req, res, next) => {
  res.send();
});

// Regenerate new token
router.get(
  "/token/regenerate",
  tokenController.regenerateToken,
  (req, res, next) => {
    res.send();
  }
);

// Create user password if token is valid
router.put(
  "/create-password",
  userController.createPassword,
  (req, res, next) => {
    res.send();
  }
);

// Login
router.post(
  "/login",
  userController.login,
  userController.accessToken,
  (req, res) => {
    const { user, token } = res.locals;
    res.send({
      token,
      user,
    });
  }
);

// Reset Password
router.post(
  "/password-reset",
  userController.passwordResetToken,
  (req, res, next) => {
    res.send();
  }
);

// Middlewares
router.use(authentication);
router.delete("/logout", userController.logout);

router.put(
  "/approve/:id",
  authorizeRole(["Admin"]),
  userController.approveUser
);
router.post(
  "/create-user",
  authorizeRole(["Admin"]),
  (req, res, next) => {
    res.locals.isApproved = true;
    next();
  },
  userController.addUser
);
//Get User
router.get("/", authorizeRole(["Admin"]), userController.getUsers);
//Get Approved Doctor
router.get("/approved-doctor", userController.getApprovedDoctor);
// Update User
router.put(
  "/update/:id",
  authorizeRole(["Admin"]),
  userController.updateUserById
);

// Delete User
router.delete(
  "/delete/:id",
  authorizeRole(["Admin"]),
  userController.deleteUserById
);
module.exports = router;
