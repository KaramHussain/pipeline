const express = require('express');
const router = express.Router();
const MonthlyReport = require('../models/MonthlyReport');
const ExpertRoaMonthly = require('../models/ExpertRoaMonthly');

router.get('/findByMonth/:projectId/:month/:year', async (req, res) => {
	try {
		const { projectId, month, year } = req.params;
		const getData = await MonthlyReport.findAll({
			where: {
				projectId: Number(projectId),
				month: Number(month),
				year: Number(year),
			},
		});
		return res.json({
			result: getData,
			type: getData.length > 0 ? getData[0].type : '',
		});
	} catch (e) {
		return res.json({ message: e.message, status: 0 });
	}
});
router.post('/create-monthly', async (req, res) => {
	try {
		const { projectId, data, year, type, month, submission_deadline } =
			req.body;

		const result = await MonthlyReport.findOne({
			where: {projectId:projectId, month:month, year:year },
		});
		if (result?.dataValues?.closed) {
			return res.json({ message: 'already closed', status: 0 });
		}

		var dataresult = [];
		for (let i = 0; i < data.length; i++) {
			const _data = {
				projectId: projectId,
				activity: data[i].activity,
				status: data[i].status,
				date: data[i].date,
				type: type,
				submission_deadline: submission_deadline,
				month: month,
				year: year,
			};

			if (data[i].id) {
				await MonthlyReport.update(
					{ ..._data },
					{
						where: { id: data[i].id },
					}
				);
				const result = await MonthlyReport.findByPk(data[i].id);
				dataresult.push(result.dataValues);
			} else {
				const data = await MonthlyReport.create(_data, {
					returning: true,
				});
				const result = await MonthlyReport.findByPk(data.dataValues.id);
				dataresult.push(result.dataValues);
			}
		}
		return res.json({ staus: 1, result: dataresult });
	} catch (e) {
		return res.json({ message: e.message, status: 0 });
	}
});

router.post('/close-month', async (req, res) => {
	try {
		const { month, year, projectId } = req.body;
		await MonthlyReport.update(
			{ closed: true },
			{
				where: { projectId: projectId, month: month, year: year },
			}
		);
		await ExpertRoaMonthly.update(
			{ closed: true },
			{
				where: { projectId: projectId, month: month, year: year },
			}
		);
		return res.json({
			status: 1,
			month,
			year,
			projectId,
			message: 'Closed successfully',
		});
	} catch (e) {
		return res.json({ message: e.message, status: 0 });
	}
});

module.exports = router;
