const Event = require("../models/Event");

exports.getAllEvents = async (req, res, next) => {
    try {
        const [events, _] = await Event.findAll();

        res.status(200).json({ events });
    } catch (error) {
        next(error);
    }
};

exports.getEventsByTeam = async (req, res, next) => {
  try {
    const {teamId} = req.body;
    const [events, _] = await Event.findByTeam(teamId);

    res.status(200).json({ events });
  } catch (error) {
      next(error);
  }
}

exports.getEventsOnDate = async (req, res, next) => {
  try {
    const {date} = req.body;
    const [events, _] = await Event.findOnDate(date);

    res.status(200).json({ events });
  } catch (error) {
      next(error);
  }
}

exports.getEventsFromDate = async (req, res, next) => {
  try {
    const {date} = req.body;
    const [eventsOnDate, _] = await Event.findOnDate(date);
    const [eventsAfterDate, _] = await Event.findFromDate(date);
    const events = {today: eventsOnDate, upcoming: eventsAfterDate};

    res.status(200).json({ events });
  } catch (error) {
      next(error);
  }
}

exports.createEvent = async (req, res, next) => {
    try {
      let { type, title = null, eventDate, timeTdb, startTime = null, endTime = null, locationId, authorId, teams, extraNotes = null, cancelled = null, notifyTeam, opponent = null, locationDetails = null, jersey = null, homeOrAway = null, arriveEarly, repeats = null } = req.body;
      const newEvent = new Event(type, title, eventDate, timeTdb, startTime, endTime, locationId, authorId, teams, extraNotes, cancelled, notifyTeam, opponent, locationDetails, jersey, homeOrAway, arriveEarly, repeats);
      res.status(200).json({ event: newEvent, id: newEvent.insertId})
    }
    catch(error){
      next(error);
    }
}

exports.updateById = async (req, res, next) => {
  try {
    let { id, type, title, eventDate, timeTdb, startTime, endTime, locationId, authorId, teams, extraNotes, cancelled, notifyTeam, opponent, locationDetails, jersey, homeOrAway, arriveEarly, repeats } = req.body;
    const event = Event.findById(id);

    event.update(type, title, eventDate, timeTdb, startTime, endTime, locationId, authorId, teams, extraNotes, cancelled, notifyTeam, opponent, locationDetails, jersey, homeOrAway, arriveEarly, repeats);
    res.status(200).json({ event: event, id: event.insertId})
  }
  catch(error){
    next(error);
  }
}

exports.deleteById = async (req, res, next) => {
  try {
    let { id } = req.body;
    const event = Event.findById(id);

    event.delete();
    res.status(200).json({ event: event, id: event.insertId})
  }
  catch(error){
    next(error);
  }
}