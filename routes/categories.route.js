const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/").categories

router.get("/detail/:categoryId", categoriesController.findOneCategory);
router.post("/create", categoriesController.create);
router.get("/findByProjectId/:projectId", categoriesController.findAllByProjectId);
router.patch("/updatecategory/:categoryId", categoriesController.updatecategory);
router.patch("/updateMargin/:categoryId", categoriesController.updateMargin);
router.delete("/delete/:categoryId", categoriesController.remove);


module.exports = router;
