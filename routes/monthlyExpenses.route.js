const express = require("express");
const router = express.Router();
const NTU_Incidental_JSON = require("../models/NTU_Incidental_JSON")


router.get("/:jobno/:month/:year", async (req, res) => {
    try {
        const { jobno, month, year } = req.params
        const result = await NTU_Incidental_JSON.sequelize.query("SELECT `job-task-no`, FORMAT(SUM(REPLACE(REPLACE(`total-cost`, '.', ''), ',', '.')), 2) AS total_cost_sum FROM `ntu`.`ntu_incidental_jsons` WHERE `job-no` =  '" + jobno + "' AND MONTH(`posting-date`) = " + month + " AND YEAR(`posting-date`) =  " + year + " GROUP BY `job-task-no`")
        if (result) {
            return res.json(result[0]);
        }
    } catch (e) {
        res.json({ message: e.message, status: 0 });
    }
})


module.exports = router;
