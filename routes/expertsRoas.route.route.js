const express = require("express");
const router = express.Router();
const expertRoasController = require("../controllers/").expertRoas

router.get("/:projectId", expertRoasController.findAllRoaByProjectId);
router.post("/create", expertRoasController.createRoa);
router.get("/findByMonth/:projectId/:month/:year", expertRoasController.findRoaByMonth);
router.delete("/delete/:id", expertRoasController.removeRoa);
router.post("/updateMargin/:expertId", expertRoasController.updateMargin);


module.exports = router;
