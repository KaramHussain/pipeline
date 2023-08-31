const express = require("express");
const router = express.Router();
const DirectCostEstimations = require("../models/DirectCostEstimations")
const Projects = require("../models/Projects")
const helperService = require("../helpers/helperService")



router.post("/estimation-create", async (req, res) => {
    try {
        const { projectId, data, total } = req.body
        await DirectCostEstimations.destroy({
            where: {
                projectid: projectId
            }
        });
        for (let i = 0; i < data.length; i++) {
            const _data = {
                projectId: projectId,
                expenseDetail: data[i].expenseDetail,
                noOfUnit: data[i].noOfUnit,
                cost: data[i].cost,
            }
           await DirectCostEstimations.create({ ..._data }, { returning: true });
        }
        await Projects.update(
            { est_om_budget: total }, {
            where: { id: projectId }
        });
        const project = await Projects.findByPk(projectId)
        //Code By waleed
     const managementRate =   await helperService.calculateManagementRateCategories({ projectId: projectId, project })
        return res.status(201).json({ message: "Data has been created successfully", management_rate:managementRate  });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message, status: 0 });
    }
})

module.exports = router;
