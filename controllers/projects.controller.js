const Projects = require("../models/Projects");
const Clients = require("../models/Clients");
const Partners = require("../models/Partners");
const Roles = require("../models/Roles");
const ProjectUserRoles = require("../models/ProjectUserRoles");
const ProjectPartners = require("../models/ProjectPartner");
const constant = require("../config/constant")
const User = require("../models/User");
const ExpertPositions = require("../models/ExpertPosition");
const Categories = require("../models/Categories");
const ExpertRoa = require("../models/ExpertRoa");
const DirectCostEstimations = require("../models/DirectCostEstimations");
const CategoryPartners = require("../models/CategoriesPartners");
const ExpertRoaMonthly = require("../models/ExpertRoaMonthly");
const helperService = require("../helpers/helperService")


module.exports.createProjects = async (req, res) => {
    try {
        const { partners } = req.body
        const existingProject = await Projects.findOne({
            where: { name: req.body.name, },
        });

        if (existingProject) {
            return res.status(200).json({ message: 'Project already exists', status: 0 })
        }

        const _createProjectDto = { ...req.body };
        _createProjectDto['userId'] = req.user.id
        const newclient = await Projects.create({ ..._createProjectDto }, { returning: true });
        for (let i = 0; i < partners.length; i++) {
            const _data = {
                projectId: newclient.id,
                partnerId: partners[i]
            }
            await ProjectPartners.create({ ..._data }, { returning: true });

        }

        const result = await Projects.findOne({
            where: { id: newclient.dataValues.id },
            include: [
                { model: Clients, attributes: ['id', 'name'] },
                { model: Categories, include: [{ model: CategoryPartners, as: 'partners' }] },
                { model: ExpertPositions, as: 'expertPositions', attributes: ['id', 'name'] },
                { model: ProjectPartners, as: 'partners', attributes: ['id'], include: [{ model: Partners, attributes: ["id", 'name'] }] },
                {
                    model: ExpertRoa, as: 'expertRoa', attributes: ['id', 'expertName', 'workingDays'], include: [
                        { model: ExpertPositions, as: 'expertPositions', attributes: ['name', 'id'] },
                        { model: Categories, attributes: ['name', 'id'] },
                    ]
                },
                { model: DirectCostEstimations, as: 'directCostEstimation' },
            ]

        });
        return res.status(200).json({ status: 1, result })

    } catch (e) {
        return res.status(200).json({ message: e.message, status: 0 })
    }
};

module.exports.findOne = async (req, res) => {
    try {
        const { userRoles } = constant
        const whereClause = { id: req.params.projectId };

        if(userRoles.PROJECT_MANAGER == req.user.role) {
            whereClause["userId"] = req.user.id;
        }

        if (userRoles.SUPER_ADMIN == req.user.role || userRoles.PROJECT_MANAGER == req.user.role) {
            const project = await Projects.findOne({
                where: whereClause,
                include: [
                    { model: Clients, attributes: ['id', 'name'] },
                    { model: Categories, include: [{ model: CategoryPartners, as: 'partners' }] },
                    { model: ExpertPositions, as: 'expertPositions', attributes: ['id', 'name'] },
                    { model: ProjectPartners, as: 'partners', attributes: ['id'], include: [{ model: Partners, attributes: ["id", 'name'] }] },
                    {
                        model: ExpertRoa, as: 'expertRoa', attributes: ['id', 'expertName', 'workingDays'], include: [
                            { model: ExpertPositions, as: 'expertPositions', attributes: ['name', 'id'] },
                            { model: Categories, attributes: ['name', 'id'] },
                            { model: ProjectPartners, as: 'partners', },
                        ]
                    },
                    { model: DirectCostEstimations, as: 'directCostEstimation' },
                ]
            });
            
            if (!project && userRoles.SUPER_ADMIN == req.user.role) {
                throw new ServiceUnavailableException('Project not found')
            }

            if(project) {
                const user = await User.findByPk(project.dataValues.userId, {
                    attributes: ['id', 'name', 'email']
                })

                return res.json({ ...project.dataValues, user: user.dataValues })
            }
        }
        if(userRoles.SUPER_ADMIN != req.user.role) {
            const project = await Projects.findOne({
                where: { id: req.params.projectId },
                include: [
                    { model: Clients, attributes: ['id', 'name'] },
                    { model: Categories, include: [{ model: CategoryPartners, as: 'partners' }] },
                    { model: ExpertPositions, as: 'expertPositions', attributes: ['id', 'name'] },
                    { model: ProjectPartners, as: 'partners', attributes: ['id'], include: [{ model: Partners, attributes: ["id", 'name'] }] },
                    {
                        model: ExpertRoa, as: 'expertRoa', include: [
                            { model: ExpertPositions, as: 'expertPositions', },
                            { model: Categories }
                        ]
                    },

                    { model: DirectCostEstimations, as: 'directCostEstimation' },

                    {
                        model: ProjectUserRoles , as:'projectUserRoles',
                        required: true,
                        attributes: ['userId'],
                        where: { projectId: req.params.projectId, userId: req.user.id },
                        include: [{ model: Roles }]
                    },

                ]
            });
            if (!project) {
                return res.json({ message: 'You are not entitled to view the project', status: 0 })
            }
            return res.json(project)
        }


    } catch (e) {
        return res.json({ message: e.message, status: 0 })
    }
}

module.exports.findAll = async (req, res) => {
    const { user } = req
    const { userRoles } = constant
    try {

        if (userRoles.SUPER_ADMIN == req.user.role) {
            const result = await getAllProjects(user)
            return res.status(200).json(result)
        }

        if (userRoles.PROJECT_MANAGER == req.user.role) {
            const result = await getAllProjectsForManager(user)
            return res.status(200).json(result)
        }
        
        const projects = await ProjectUserRoles.findAll({
            include: [{
                model: Projects, include: [
                    { model: Clients, attributes: ['id', 'name'] },
                    { model: Categories, attributes: ['id', 'name', 'feeRate', 'workingDays'] },
                    { model: ExpertPositions, as: 'expertPositions', attributes: ['id', 'name'] },
                    { model: ProjectPartners, as: 'partners', attributes: ['id'], include: [{ model: Partners, attributes: ['name'] }] },
                ]
            }],
            where: { userId: req.user.id },
        })

        const result = projects.map((project) => (project.dataValues.project))
        return res.status(200).json(result)
    } catch (e) {
        res.json({ message: e.message, status: 0 })
    }
};


module.exports.updateProjects = async (req, res) => {
    try {
        const ProjectsBody = req.body
        const update = await Projects.update({ ...ProjectsBody }, { where: { id: req.params.id } });

        if (update[0] == 1) {
            const Projects = await Projects.findByPk(req.params.id)
            return responseHelper.success(res, Projects, constant.UPDATE_Projects_SUCCESS);
        } else {
            return responseHelper.requestfailure(res, constant.Projects_NOT_FOUND);
        }

    } catch (e) {
        return res.json({ message: e.message, status: 0 })
    }
};


module.exports.fetchProjectsById = async (req, res) => {
    try {
        const Projects = await Projects.findByPk(req.params.id)
        return responseHelper.success(res, Projects,);
    } catch (e) {
        return res.json({ message: e.message, status: 0 })
    }
};



module.exports.delete = async (req, res) => {
    try {
        const { projectId } = req.params
        const { user } = req;

        const projectFound = await  Projects.findOne({
            where: {
                id: projectId,
                userId: user.id,
            }
        });

        if(![constant.userRoles.SUPER_ADMIN].includes(user.role)) {
            if(user.role === constant.userRoles.PROJECT_MANAGER && !projectFound) {
                throw Error("You are not authorized to delete this project")
            }
        }


        await ExpertRoaMonthly.destroy({
            where: { projectId: projectId },
        });

        await ExpertRoa.destroy({
            where: { projectId: projectId },
        });

        await ProjectUserRoles.destroy({
            where: { projectId: projectId },
        });

        const project = await Projects.destroy({
            where: { id: projectId },
        });
        if (!project) {
            return res.status(404).json({ message: 'not found', status: 0 })
        }
        return res.status(200).json({ message: 'Project deleted successfully', projectId: Number(req.params.projectId),status: 1 })
    } catch (e) {
        return res.status(404).json({ message: e.message, status: 0 })
    }
};

module.exports.createHrBudget = async (req, res) => {
    try {
        const { projectId, est_hr_budget, est_inc_bud, est_ver_bud } = req.body
        await Projects.update(
            { est_hr_budget: est_hr_budget, est_inc_bud, est_ver_bud }, {
            where: { id: projectId }
        });
        const management_rate = await helperService.calculateManagementRate({ projectId, est_hr_budget })
        return res.status(200).json({ message: 'Project saved successfully', management_rate: management_rate })

    } catch (e) {
        return res.status(404).json({ message: e.message, status: 0 })


    }
}

module.exports.getProjectAssignedUsers = async (req,res) => {

    try {
        const { role } = req.user;
        if(role !== constant.userRoles.SUPER_ADMIN) {
            const projectOwned = await Projects.findOne({
                where: { id: req.params.projectId, userId: req.user.id },
            });

            if(!projectOwned) {
                const projectAssigned = await Projects.findOne({
                    where: { id: req.params.projectId },
                    include: [
                        {
                            model: ProjectUserRoles , as:'projectUserRoles',
                            required: true,
                            where: { projectId: req.params.projectId, userId: req.user.id },
                            include: [{ model: Roles }]
                        },
    
                    ]
                });

                if(!projectAssigned || (projectAssigned && !projectAssigned.projectUserRoles[0].role.assign_role)) {
                    throw Error("You are not authorized")
                }
            }
        }
        const result = await ProjectUserRoles.findAll({
            include: [{ model: User }, { model: Roles }],
            where: { projectId: req.params.projectId }

        });
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
        return res.status(200).json({ message: e.message, status: 0})


    }
}
module.exports.assignedProjectUserRole = async (req,res) => {
    const {selectedRole}=req.body
    try {
        await ProjectUserRoles.update({ roleId: selectedRole ? selectedRole : null }, {
            where: { id: req.params.roleId }
        });
        const result = await ProjectUserRoles.findByPk(req.params.roleId, {
            include: [{ model: User }, { model: Roles }]
        })
        return res.status(200).json({ message: 'Role updated successfully', result })
    } catch (e) {
        return res.status(200).json(e.message)


    }
}

module.exports.addUserToProject = async (req,res) => {

    try {
        const { projectId, userId } = req.body
        const [assigned, created] = await ProjectUserRoles.findOrCreate({
            where: {
                projectId, userId
            }
        });
        if(!created) {
            throw Error("User already assigned!");
        }
        const user = await ProjectUserRoles.findByPk(assigned.dataValues.id, {
            include: [{ model: User }, { model: Roles }]
        })
        return res.status(200).json({ message: 'User assigned successfully', user, created })
    } catch (e) {
        return res.status(200).json({ message: e.message, status: 0})


    }
}


module.exports.removedUserFromProject = async (req,res) => {

    try {
        await ProjectUserRoles.destroy({
            where: { id: req.params.roleId },
        });
        return res.status(200).json({ message: 'User removed successfully', roleId: req.params.roleId })
    } catch (e) {
        return res.status(200).json(e.message)


    }
}





const getAllProjects = async () => {
    return await Projects.findAll({
        include: [
            { model: Clients, attributes: ['id', 'name'] },
            { model: Categories, attributes: ['id', 'name', 'feeRate', 'workingDays'] },
            { model: ExpertPositions, as: 'expertPositions', attributes: ['id', 'name'] },
            { model: ProjectPartners, as: 'partners', attributes: ['id'], include: [{ model: Partners, attributes: ['name'] }] },
        ]
    });
}

const getAllProjectsForManager = async (user) => {

    const data = await Promise.all([Projects.findAll({
        where: { userId: user.id },
        include: [
            { model: Clients, attributes: ['id', 'name'] },
            { model: Categories, attributes: ['id', 'name', 'feeRate', 'workingDays'] },
            { model: ExpertPositions, as: 'expertPositions', attributes: ['id', 'name'] },
            { model: ProjectPartners, as: 'partners', attributes: ['id'], include: [{ model: Partners, attributes: ['name'] }] },
        ]
    }),

    ProjectUserRoles.findAll({
        include: [{
            model: Projects, include: [
                { model: Clients, attributes: ['id', 'name'] },
                { model: Categories, attributes: ['id', 'name', 'feeRate', 'workingDays'] },
                { model: ExpertPositions, as: 'expertPositions', attributes: ['id', 'name'] },
                { model: ProjectPartners, as: 'partners', attributes: ['id'], include: [{ model: Partners, attributes: ['name'] }] },
            ]
        }],
        where: { userId:  user.id },
    })

    ])

    const projects = data[0]
    const assignProjects = data[1]
    const myprojects = assignProjects.map((project) => (project.project))
    const result = [...projects,...myprojects ]
    return result
}





