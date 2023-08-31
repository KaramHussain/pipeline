const express = require("express");
const router = express.Router();
const { authenticate } = require("../helpers/auth.helper")


router.use('/categories',  require('./categories.route'));
router.use('/roles', require('./roles.route'));
router.use('/experts-positions', require('./expertsPositions.route'));
router.use('/direct-cost', require('./directCost.route'));
router.use('/experts-roa', require('./expertsRoas.route'));
router.use('/monthly-report', require('./monthlyReport.route'));
router.use('/users',  require('./user.route'));
router.use('/projects', authenticate, require('./projects.route'));
router.use('/clients', authenticate, require('./clients.route'));
router.use('/monthly-expenses', authenticate, require('./monthlyExpenses.route'));


module.exports = router;
