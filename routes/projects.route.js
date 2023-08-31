const express = require("express");
const router = express.Router();
const projectsController = require("../controllers/").projects


router.get("/", projectsController.findAll);
router.post("/create", projectsController.createProjects);
 router.get("/detail/:projectId", projectsController.findOne);
router.delete("/delete/:projectId", projectsController.delete);
router.post("/hr_budget/create", projectsController.createHrBudget);
router.post("/add-user", projectsController.addUserToProject);
router.get("/get-assigned-users/:projectId", projectsController.getProjectAssignedUsers);
router.delete("/removed-user/:roleId", projectsController.removedUserFromProject);
router.patch("/assign-projecct-user-role/:roleId", projectsController.assignedProjectUserRole);



module.exports = router;
