const ExpertPositions = require("../models/ExpertPosition");
const constant = require("../config/constant")

module.exports.getExpertPosistionsByProjectId = async (req, res) => {
    try {
        const expertPositions = await ExpertPositions.findAll({
            where: { projectId: projectId },
          });
          return  res.json(expertPositions)
    } catch (e) {
        return res.json({ message: e.message, status: 0 });
    }
}

module.exports.createExpertPosition = async (req, res) => {
    try {
        const { projectId } = req.body
        const _createcreateExpertPositionDto = { ... req.body };
        _createcreateExpertPositionDto['project'] = projectId
        const newclient = await ExpertPositions.create({ ..._createcreateExpertPositionDto }, { returning: true });
        return res.json(newclient);
    } catch (e) {
        return res.json({ message: e.message });

    }
};


module.exports.removeExpertPosition = async (req, res) => {
    try {
        const expertPosition = await ExpertPositions.destroy({
            where: { id: req.params.id },
          });
          if (!expertPosition)  return res.json({ message: 'Expert position not found', status: 0 });
        return res.json( { message: 'Expert position deleted successfully' });
    } catch (e) {
        return res.json({ message: e.message, status: 0 });
    }
};
