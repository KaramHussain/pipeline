const express = require("express");
const router = express.Router();
const expertPositionsController = require("../controllers/").expertPositions


router.get("/positions/:projectId", expertPositionsController.getExpertPosistionsByProjectId);
router.post("/create", expertPositionsController.createExpertPosition);
router.delete("/delete/:id", expertPositionsController.removeExpertPosition);


module.exports = router;
