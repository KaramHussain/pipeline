const Categories = require("../models/Categories");
const CategoryPartners = require("../models/CategoriesPartners");
const helperService = require("../helpers/helperService")
const Projects = require("../models/Projects");
const ExpertRoa = require("../models/ExpertRoa");
const { sequelize } = require("../config/db");
const Partners = require("../models/Partners");
const ProjectPartner = require("../models/ProjectPartner");
const { Op } = require("sequelize");

module.exports.create = async (req, res) => {
    try {
        const { projectId } = req.body

        const _createProjectDto = {
            name: req.body.name,
            workingDays: req.body.workingDays,
            feeRate: req.body.feeRate,
            projectId: req.body.projectId,
        };

        const categoryFound = await Categories.findOne({
            where: {
                name: {
                    [Op.like]: `%${req.body.name}%`
                },
                projectId,
            }
        });

        if(categoryFound) {
            throw Error("Category already exists");
        }

        var newCategory = await Categories.create({ ..._createProjectDto }, { returning: true });

        for (let partner of req.body.partners) {
            await CategoryPartners.create({
                categoryId: newCategory.id,
                partnerId: partner.partnerId,
                workingDays: partner.workingDays,
                projectId: req.body.projectId
            }, { returning: true });
        }

        const result = await Categories.findByPk(newCategory.id, {
            include: [{ model: CategoryPartners, as: 'partners' }]
        })
        const project = await Projects.findByPk(projectId);
        if (project.dataValues.est_om_budget) {
            const management_rate = await helperService.calculateManagementRateCategories({ projectId, project })
            return res.status(201).json({ newCategory: result, management_rate });

        }
        return res.status(201).json({ newCategory: result, management_rate: 0 });
    } catch (e) {
        return res.status(500).json({ message: e.message, status: 0 });
    }
}
module.exports.remove = async (req, res) => {
    try {
        const category = await Categories.findByPk(req.params.categoryId);
        if (!category) return res.status(500).json({ message: 'Categry not found', status: 0 });

        await Categories.destroy({
            where: {
                id: req.params.categoryId,
            },
        });
        const calculation = Number(category.workingDays) * Number(category.feeRate)
        const project = await Projects.findByPk(category.dataValues.projectId)
        await helperService.calculateManagementRateCategories({ projectId: category.dataValues.projectId, project })
        return res.status(200).json({ message: 'Category deleted successfully', categoryId: category.dataValues.id });

    } catch (e) {
        return res.status(500).json({ message: e.message, status: 0 });
    }
}


module.exports.findOneCategory = async (req, res) => {
    try {
        const category = await Categories.findOne({
            where: { id: Number(req.params.categoryId) },
            include: [{ model: CategoryPartners, as: 'partners' }]
        });
        return res.status(200).json(category);

    } catch (e) {
        return res.status(500).json({ message: e.message, status: 0 });

    }
};


module.exports.findAllByProjectId = async (req, res) => {
    try {
        const categories = await Categories.findAll({
            where: { projectId: req.params.projectId }
        });
        return res.status(200).json(categories);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: 0 });
    }
};




module.exports.updatecategory = async (req, res) => {
    try {
        const _updateCategoryDto = {
            name: req.body.name,
            workingDays: req.body.workingDays,
            feeRate: req.body.feeRate,
        };
        const { partners } = req.body;
        const { categoryId } = req.params;

        await Categories.update(_updateCategoryDto, {
            where: { id: categoryId },
        });

        const partnersIds = partners.map(partner => partner.id);
        const expertsOfPartners = await ExpertRoa.findAll({
            where: {
                partnerId: partnersIds,
                categoryId,
            },
            attributes: [
                'partnerId',
                [sequelize.fn('SUM', sequelize.col('workingDays')), 'workingDaysSum'],
              ],
            group: ['partnerId'],
            include: {
                model: ProjectPartner,
                as: "partners",
                include: {
                    model: Partners
                }
            }
        });
        
        for(let partner of partners) {
            const result = expertsOfPartners.find(expert => expert.partnerId === partner.id);
            if(result && result.dataValues.workingDaysSum > partner.workingDays) {
                throw Error(`WDs of ${result.partners.partner.name} cannot be lower than the assigned WDs for experts`)
            }
        }

        for (let partner of partners) {
            await CategoryPartners.update({
                workingDays: partner.workingDays,
            }, {
                where: { partnerId: partner.id, categoryId },
            });
        }

        const result = await Categories.findByPk(req.params.categoryId, {
            include: {
                model: CategoryPartners,
                as: "partners"
            }
        })
        const project = await Projects.findByPk(result.dataValues.projectId)
        await helperService.calculateManagementRateCategories({ projectId: project.dataValues.id, project })
        return res.json({ message: 'Category updated successfully', result });

    } catch (e) {
        return res.status(500).json({ message: e.message, status: 0 });

    }

}


module.exports.updateMargin = async () => {
    try {
        const { est_margin_per_wd, est_percent_margin, expert_fee, expert_allowance, transport, misc } = req.body

        await Categories.update({
            est_margin_per_wd: est_margin_per_wd,
            est_percent_margin: est_percent_margin,
            expert_fee, expert_allowance, transport, misc
        }, {
            where: { id: req.params.categoryId },
        });
        const result = await Categories.findByPk(req.params.categoryId)
        return res.json({ message: 'Category updated successfully', result });

    } catch (e) {

    }

}