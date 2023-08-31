const express = require("express");
const router = express.Router();
const expertRoaController = require("../controllers/").expertRoas

router.post("/create", expertRoaController.createRoa);
router.get("/:projectId", expertRoaController.findAllRoaByProjectId);
router.get("/findByMonth/:projectId/:month/:year", expertRoaController.findRoaByMonth);
router.delete("/delete/:id", expertRoaController.removeRoa);
router.post("/monthly-create", expertRoaController.createRoaMonthly);
router.patch("/updateMargin/:expertId", expertRoaController.updateMargin);
router.get("/getrexpertrecords/:expertId/:projectId", expertRoaController.getrexpertrecords);




module.exports = router;
