const express = require("express");
const router = express.Router();
const Clients = require("../models/Clients")
const Partners = require("../models/Partners")
const ProjectPartner = require("../models/ProjectPartner")


router.get("/", async (req, res) => {
    try {
        const result = await Clients.findAll({});
        res.json(result);
    } catch (e) {
        res.json({ message: e.message, status: 0 });
    }
})


router.delete("/delete/:clientId", async (req, res) => {
    try {
        const client = await Clients.destroy({
            where: { id: req.params.clientId },
        });
        if (!client) {
            return res.json({ message: 'Client not found', status: 0 });
        }
        return res.json({ message: 'Client deleted successfully', status: 1,id:req.params.clientId });
    } catch (e) {
        return res.json({ message: e.message, status: 0 });
    }
})


router.post("/create", async (req, res) => {
    try {
        const existingClient = await Clients.findOne({
            where: { name: req.body.name }
        });
        if (!existingClient) {
            const _createClient = req.body
            const newclient = await Clients.create({ ..._createClient }, { returning: true });
            return res.json(newclient);
        }
        return res.json({ message: 'Client already exists', status: 0 });

    } catch (e) {
        return res.json({ message: e.message, status: 0 });
    }
})


router.post("/partners-create", async (req, res) => {
    try {
        const existingPartners = await Partners.findOne({
            where: { name: req.body.name }
        });
        if (!existingPartners) {

            const _createClient = req.body
            _createClient['userId'] = req.user.id

            const newclient = await Partners.create({ ..._createClient }, { returning: true });
            return res.json(newclient);
        }
        return res.json({ message: 'Partner already exists', status: 0 });

    } catch (e) {
        return res.json({ message: e.message, status: 0 });
    }
})


router.get("/partners-list", async (req, res) => {
    try {
        const result = await Partners.findAll({});
        return res.json(result);
    } catch (e) {
        return res.json({ message: res.message, status: 0 });
    }
})

router.delete("/partners-delete/:id", async (req, res) => {
    try {
        const client = await Partners.destroy({
            where: { id: req.params.id },
        });
        if (!client) {
            return res.json({ message: 'Partner not found', status: 0 });
        }
        return res.json({ message: 'Partner deleted successfully', status: 1 ,id:req.params.id});
    } catch (e) {
        return res.json({ message: e.message, status: 0 });
    }
})


router.delete("/project-partners-delete/:id", async (req, res) => {
    try {
        const part = await ProjectPartner.destroy({
            where: { id: req.params.id },
        });

        if (!part) {
            return res.json({ message: 'Partner not found', status: 0 });
        }
        return res.json({ message: 'Partner deleted successfully' });
    } catch (e) {
        return res.json({ message: e.message, status: 0 });
    }
})
module.exports = router;
