const express = require("express");
const router = express.Router();
const usersController = require("../controllers/").user
const upload=require("../helpers/file.helper")
const { authenticate } = require("../helpers/auth.helper")

router.get("/", authenticate,usersController.findAll);
router.get("/getallUsers",authenticate, usersController.getallUsers);
router.post("/usercreation",authenticate,usersController.UserCreation)
router.patch("/update-profile",authenticate,upload.single("file"), usersController.updateProfile);
router.patch("/:id",authenticate, usersController.updateRole);
router.post("/login/admin", usersController.login);
router.post("/login/microsoft", usersController.loginMicrosoft);
router.get("/current", authenticate, usersController.currentUser);
router.delete("/delete/:id", authenticate, usersController.deleteUser);

module.exports = router;
