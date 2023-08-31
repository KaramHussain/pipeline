const Projects =require("../models/Projects")
const Categories =require("../models/Categories")

module.exports.calculateManagementRate = async ({ projectId, est_hr_budget }) => {
    const project = await Projects.findByPk(projectId);
    //Code By Waleed
    let management_rate = 0;
    if(project.est_om_budget == null){
     management_rate=est_hr_budget/est_hr_budget;
}else if(project.est_om_budget){
    const cal = est_hr_budget - Number(project.est_om_budget)
     management_rate = cal / est_hr_budget
}
    await Projects.update(
        { est_hr_budget: est_hr_budget, management_rate: management_rate }, {
        where: { id: projectId }
    });
    return management_rate
}

module.exports.calculateManagementRateCategories = async ({ projectId, project }) => {
    const categories = await Categories.findAll({
        where: { projectId: projectId }
    })

    if(categories.length ==0) {
        await Projects.update(
            { management_rate: 0 }, {
            where: { id: projectId }
        });

        return 0
    }

    let est_hr_budget = 0
    for (let i = 0; i < categories.length; i++) {
        est_hr_budget += Number(categories[i].dataValues.workingDays) * Number(categories[i].dataValues.feeRate)
    }
    const cal = est_hr_budget - Number(project.dataValues.est_om_budget)
    const management_rate = cal / est_hr_budget

    const selecetdCategories1 = [...categories]
    const newarray = []
    selecetdCategories1.forEach((cat) => {
        let netFee = cat.dataValues.feeRate * management_rate
        const marginPweWd = netFee - (Number(cat.dataValues.expert_fee) + Number(cat.dataValues.expert_allowance) + Number(cat.dataValues.transport) + Number(cat.dataValues.misc))
        const percentagemargin = (marginPweWd / netFee) * 100
        newarray.push({ ...cat.dataValues, est_margin_per_wd: marginPweWd, est_percent_margin: percentagemargin })
    })

    for (let i = 0; i < newarray.length; i++) {
        await Categories.update(
            newarray[i], {
            where: { id: newarray[i].id }
        });
    }

    await Projects.update(
        { management_rate: management_rate, est_hr_budget: est_hr_budget }, {
        where: { id: projectId }
    });
    return management_rate
}

