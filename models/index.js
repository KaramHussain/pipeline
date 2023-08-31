
const Projects= require("./Projects")
const Clients= require("./Clients");
const Partners = require("./Partners");
const ProjectPartner = require("./ProjectPartner");
const ProjectUserRoles = require("./ProjectUserRoles");
const Roles = require("./Roles");
const ExpertRoa = require("./ExpertRoa");
const ExpertPositions = require("./ExpertPosition");
const ExpertRoaMonthly = require("./ExpertRoaMonthly");

const Categories = require("./Categories");
const CategoryPartners = require("./CategoriesPartners");
const DirectCostEstimations = require("./DirectCostEstimations");
const User = require("./User");


// { onDelete: 'cascade', hooks:true }



// /*--------Users Associations ---------*/

Projects.belongsTo(Clients,{foreignKey:'clientId'});
Projects.hasMany(ProjectPartner,{as:'partners'});
Projects.hasMany(ExpertPositions,{as:'expertPositions',onDelete: 'cascade'});
Projects.hasMany(Categories,{onDelete: 'cascade'});
Projects.hasMany(DirectCostEstimations,{as:'directCostEstimation',onDelete: 'cascade'});
Projects.hasMany(ExpertRoa,{as:'expertRoa'});
Projects.hasMany(ProjectUserRoles,{as:'projectUserRoles'});



Categories.hasMany(CategoryPartners,{as:'partners'});



ProjectPartner.belongsTo(Partners);
ProjectPartner.belongsTo(Projects);


ProjectUserRoles.belongsTo(Projects);
ProjectUserRoles.belongsTo(Roles);
ProjectUserRoles.belongsTo(User);



ExpertRoa.belongsTo(ExpertPositions,{as:'expertPositions',foreignKey:'expertPositionId'});
ExpertRoa.belongsTo(ProjectPartner,{as:'partners',foreignKey:'partnerId'});
ExpertRoa.belongsTo(Categories);



ExpertRoaMonthly.belongsTo(ExpertRoa,{foreignKey:'expertId'});
ExpertRoaMonthly.belongsTo(ExpertPositions,{as:'expertPositions',foreignKey:'expertPositionId'});
ExpertRoaMonthly.belongsTo(ProjectPartner,{as:'partners',foreignKey:'partnerId'});
ExpertRoaMonthly.belongsTo(Categories);



// ErMaster.belongsTo(User, { as: 'vb', foreignKey: 'verification_body' });

// User.hasMany(ErMaster, { foreignKey: 'id' });

// ErAeredromPairDetail.belongsTo(ErMaster, { as: 'ermaster', foreignKey: 'ErId' });

