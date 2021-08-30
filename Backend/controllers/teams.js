const Team = require("../models/Team");

exports.getAllTeams = async (req, res, next) => {
    try {
        const [teams, _] = await Team.findAll();

        res.status(200).json({ teams });
    } catch (error) {
        next(error);
    }
};

exports.getTeamById = async (req, res, next) => {
  try {
    let { id } = req.params;
    const [team, _] = await Team.findById(id);

    res.status(200).json({ team });
  } catch (error) {
      next(error);
  }
}

exports.createTeam = async (req, res, next) => {
    try {
        console.log("Joell req.body", req.body);
        let {name, ageGroup} = req.body;
        
        const newTeam = new Team(name, ageGroup);
        
        const [team, _] = await newTeam.save()
        res.status(200).json({ team: { ...newTeam, id: team.insertId } })
    } catch (error) {
        next(error);
    }
}

exports.updateById = async (req, res, next) => {
    return null
}

exports.deleteById = async (req, res, next) => {
    return null
}