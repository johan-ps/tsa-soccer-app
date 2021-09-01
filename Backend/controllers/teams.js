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

exports.getAllUsersFromTeam = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [coaches, _] = await Team.findAllCoaches(id);
        const [players, __] = await Team.findAllPlayers(id);
        console.log("Joell players", players);
        const users = {coaches, players};
        res.status(200).json({ users });
    } catch (error) {
        next(error);
    }
};


exports.createTeam = async (req, res, next) => {
    try {
        console.log("Joell req.body", req.body);
        let {name, ageGroup, type} = req.body;
        
        const newTeam = new Team(name, ageGroup, type);
        
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