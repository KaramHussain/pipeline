const ExpertRoa = require("../models/ExpertRoa");
const ExpertPositions = require("../models/ExpertPosition");
const ExpertRoaMonthly = require("../models/ExpertRoaMonthly");
const Sequelize=require("sequelize")
const Categories = require("../models/Categories");
const ProjectPartners = require("../models/ProjectPartner");

const constant = require("../config/constant");
const CategoryPartners = require("../models/CategoriesPartners");
const { nullChecker } = require("../helpers/validation.helper");

async function getMonthlyRecordsSum(projectId, expertId) {
  const expertRoa = await ExpertRoa.findByPk(expertId)
  const mroas = await ExpertRoaMonthly.findAll({
    where: { projectId: projectId, expertId: expertId },
    group: ['expertId'],
    attributes: [
      [Sequelize.fn('sum', Sequelize.col('workingDays')), 'total_consumed'],
    ]
  });

  var total_wds = expertRoa.dataValues.workingDays
  if (mroas.length > 0) {
    var consumed = Number(mroas[0].dataValues.total_consumed)
    return { consumed, total_wds }
  } else {
    return { consumed: 0, total_wds }
  }

}

module.exports.findAllRoaByProjectId = async (req, res) => {
  try {
    const expertPositions = await ExpertRoa.findAll({
      where: { projectId: Number(req.params.projectId) },
      include: [
        { model: ExpertPositions, as: 'expertPositions', },
        { model: Categories, },
      ]
    });
    return res.status(200).json(expertPositions)
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 0 });
  }
}

module.exports.createRoa = async (req, res) => {
  try {
    const _createcreateExpertRoaDto = { ...req.body };
    const workingDaysOfExpert = Number(_createcreateExpertRoaDto.workingDays);
    const { partnerId, categoryId } = _createcreateExpertRoaDto;

    const [totalWorkingDaysOfPartner, projectPartner] = await Promise.all([ExpertRoa.sum("workingDays", {
      where: {
        partnerId,
        categoryId
      }
    }), CategoryPartners.findOne({
      where: {
        partnerId,
        categoryId
      }
    })]);

    if(!projectPartner || (workingDaysOfExpert + nullChecker(totalWorkingDaysOfPartner)) > projectPartner.workingDays) {
      throw new Error("Working Days of Expert cannot exceed from the working days of Category")
    }

    const newCategory = await ExpertRoa.create({ ..._createcreateExpertRoaDto }, { returning: true });

    const roa = await ExpertRoa.findByPk(newCategory.dataValues.id, {
      include: [
        { model: ExpertPositions, as: 'expertPositions', attributes: ['name', 'id'] },
        { model: Categories, attributes: ['name', 'id'] },
        { model: ProjectPartners, as: 'partners' }

      ]
    });
    return res.status(201).json(roa);
  } catch (e) {
    return res.json({ message: e.message, status: 0 });

  }
};
module.exports.findRoaByMonth = async (req, res) => {
  try {
    const { projectId, month, year } = req.params

    const data = await ExpertRoa.findAll({
      include: [

        { model: ExpertPositions, as: 'expertPositions', attributes: ['name', 'id'] },
        { model: Categories, attributes: ['name', 'id'] },
        { model: ProjectPartners, as: 'partners', attributes: ['partnerId', 'id'] },
      ],
      where: { projectId: Number(projectId) }
    });

    const result = await ExpertRoaMonthly.findAll({
      include: [
        { model: ExpertRoa },
        { model: ExpertPositions, as: 'expertPositions', attributes: ['name', 'id'] },
        { model: Categories, attributes: ['name', 'id'] },
        { model: ProjectPartners, as: 'partners', attributes: ['partnerId', 'id'] }
      ],
      where: { projectId: Number(projectId), month: Number(month), year: Number(year) }
    });
  
    if (result.length) {
      const formatedData = []
      data.map(item => {
        let item2 = result.find(i2 => i2.dataValues.expertId ===item.dataValues.id);
        if (item2) {
          const obj = {
            expertName: item2.dataValues.expert_roa.expertName,
            expertId: item2.dataValues.expert_roa.id,
            workingDays: item2.workingDays,
            expertPosition: item2.dataValues.expertPositions.dataValues,
            category: item2.dataValues.category.dataValues,
            projectId: item2.dataValues.projectId,
            ppartnerId: item2.dataValues.partnerId,
            partnerId: item2.dataValues.partners.partnerId
          }
          formatedData.push(obj);
        } else {
          const obj = {
            expertName: item?.dataValues.expertName,
            expertId: item?.dataValues.id,
            workingDays: "",
            expertPosition: item?.dataValues.expertPositions.dataValues,
            category: item?.dataValues.category.dataValues,
            projectId: item?.dataValues.projectId,
            ppartnerId: item?.dataValues.partnerId,
            partnerId: item?.dataValues.partners.partnerId
          }
      
          formatedData.push(obj);
        }

      });
      return res.status(200).json({ result: formatedData });
    } else {
      // if zoro
      var formatedData1 = []
      const result = await ExpertRoa.findAll({
        include: [
  
          { model: ExpertPositions, as: 'expertPositions', attributes: ['name', 'id'] },
          { model: Categories, attributes: ['name', 'id'] },
          { model: ProjectPartners, as: 'partners', attributes: ['partnerId', 'id'] },
        ],
        where: { projectId: Number(projectId) }
      });
      result.map((i)=>{
        const obj = {
          expertName: i.dataValues.expertName,
          expertId: i.dataValues.id,
          workingDays: "",
          expertPosition: i.dataValues.expertPositions.dataValues,
          category: i.dataValues.category.dataValues,
          projectId: i.dataValues.projectId,
          ppartnerId: i.dataValues.partnerId,
          partnerId: i.dataValues.partners.partnerId
        }
        formatedData1.push(obj);
      })

      return res.status(200).json({ result: formatedData1 });
    }

  } catch (e) {
    return res.status(500).json({ message: e.message, status: 0 });
  }
}
module.exports.getrexpertrecords = async (req, res) => {
  try {
    const { expertId,projectId} = req.params

    const result = await ExpertRoaMonthly.findAll({
      attributes:['workingDays','month','year'],
      include: [
        // { model: ExpertRoa },
        // { model: ExpertPositions, as: 'expertPositions', attributes: ['name', 'id'] },
        // { model: Categories, attributes: ['name', 'id'] },
        // { model: ProjectPartners, as: 'partners', attributes: ['partnerId', 'id'] }
      ],
      where: { projectId: Number(projectId), expertId:expertId }
    });
    
    return res.json({result,status:1})

  } catch (e) {
    return res.status(500).json({ message: e.message, status: 0 });
  }
}



module.exports.removeRoa = async (req, res) => {
  try {
    const expertPosition = await ExpertRoa.destroy({
      where: { id: req.params.id },
    });
    if (!expertPosition) return res.json({ message: 'Expert roa not found', status: 0 });
    return res.json({ message: 'Expert roa deleted successfully' });
  } catch (e) {
    return res.json({ message: e.message, status: 0 });
  }
};


module.exports.createRoaMonthly = async (req, res) => {
  try {
    var { projectId, year, month, data } = req.body
    const { expertId, partnerId, categoryId, expertPositionId, workingDays } = data

    
		const checkRoa = await ExpertRoaMonthly.findOne({
			where: {projectId:projectId, month:month, year:year },
		});
		if (checkRoa?.dataValues?.closed) {
			return res.json({ message: 'already closed', status: 0 });
		}

    var _data1 = {
      expertId,
      projectId,
      expertPositionId,
      workingDays,
      partnerId,
      categoryId,
      year, month,
    }

    const { consumed, total_wds } = await getMonthlyRecordsSum(projectId, expertId)
    let entryWds = Number(consumed)

    const checkRecord = await ExpertRoaMonthly.findOne({
      where: { projectId, expertId, year, month }
    })

    if (checkRecord) {

      entryWds -= checkRecord.dataValues.workingDays
      const sum = entryWds + workingDays
      const remaning = total_wds - entryWds

      if (sum <= total_wds) {
        await ExpertRoaMonthly.update({ workingDays: workingDays }, { where: { id: checkRecord.id } });
      return res.status(200).json({ message: 'Monthly WDs inserted successfully' , status: 1 });
      } else {
      return res.status(200).json({ message: `You have ${remaning} WDs left`, status: 0 });
      }

    }
    const sum = entryWds + workingDays
    const remaning = total_wds - entryWds
    if (sum <= total_wds) {
      const data = await ExpertRoaMonthly.create({ ..._data1 }, {
        returning: true
      });
      return res.status(200).json({ message: 'Monthly WDs inserted successfully' , status: 1 });

    } else {
      return res.status(200).json({ message: `You have ${remaning} WDs left`, status: 0 });
    }

  } catch (e) {
    return res.status(400).json({ message: e.message, status: 0 });
  }
};

module.exports.updateMargin = async (req, res) => {
  try {
    const { est_margin_per_wd, est_percent_margin,
      net_fee, management_fee,
      expert_fee, expert_allowance, transport, misc } = req.body

    await ExpertRoa.update({
      est_margin_per_wd: est_margin_per_wd, management_fee,
      est_percent_margin: est_percent_margin,
      expert_fee, expert_allowance, transport, misc, net_fee
    }, {
      where: { id: Number(req.params.expertId) },
    });
    const result = await ExpertRoa.findByPk(Number(req.params.expertId), {
      include: [Categories]
    })
    return res.json({ message: 'Expert updated successfully', result });
  } catch (e) {
    return res.status(500).json({ message: e.message, status: 0 });
  }
};



