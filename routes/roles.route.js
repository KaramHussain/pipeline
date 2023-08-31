const express = require("express");
const router = express.Router();
const Roles = require("../models/Roles")


router.get("/", async (req, res) => {
    try {
        const result = await Roles.findAll()
        return res.json(result);
    } catch (e) {
        return res.json({ message: res.message, status: 0 });
    }
})


router.post("/create", async (req, res) => {
    try {
        const result = await Roles.create({ ...req.body }, { returning: true })
        return res.json(result)
    } catch (e) {
        return res.json({ message: e.message, status: 0 });
    }
})


router.patch("/update/:id", async (req, res) => {
    try {
        await Roles.update({ ...req.body }, {
            where: { id: req.params.id },
        })
        const result = await Roles.findByPk(req.params.id)
        return res.json(result);
    } catch (e) {
        return res.json({ message: res.message, status: 0 });
    }
})




router.delete("/:id", async (req, res) => {
    try {
        await Roles.destroy({
            where: { id: req.params.id }
        })
        return res.json({ message: 'Role deleted successfully', roleId: req.params.id });
    } catch (e) {
        return res.json({ message: e.message, status: 0 });
    }
})



module.exports = router;
