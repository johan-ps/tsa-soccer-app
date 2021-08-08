const Event = require("../models/Event");

exports.getAllEvents = async (req, res, next) => {
    try {
        const [evente, _] = await Event.findAll();

        res.status(200).json({ announcements });
    } catch (error) {
        next(error);
    }
};

exports.getEventsByTeam = async (req, res, next) => {
    return null
}

exports.createEvent = async (req, res, next) => {
    return null
}

exports.updateById = async (req, res, next) => {
    return null
}

exports.deleteById = async (req, res, next) => {
    return null
}