const Event = require("../models/Event");
const Team = require("../models/Team");
const dateFormat = require('../utils/dateFormat');

exports.getAllEvents = async (req, res, next) => {
    try {
        const [events, _] = await Event.findAll();
        
        res.status(200).json({ events });
    } catch (error) {
        next(error);
    }
};

exports.getEventById = async (req, res, next) => {
  try {
    const {id} = req.params;
    const [event, _] = await Event.findById(id);
    console.log("Joell event", event);
    res.status(200).json({ event });
  } catch (error) {
      next(error);
  }
}


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
    const {date, userId} = req.body;
    const [events, _] = await Event.findByDate(date, userId);

    res.status(200).json({ events });
  } catch (error) {
      next(error);
  }
}

exports.getEventsFromDate = async (req, res, next) => {
  try {
    const {date, userId} = req.query;
    console.log("Joell userId", userId);
    let eventDate = new Date(date);
    eventDate = dateFormat.dateTime(eventDate);
    const [eventsOnDate, _] = await Event.findByDate(eventDate, userId);
    const [eventsAfterDate, __] = await Event.findFromDate(eventDate, userId);
    const events = {today: eventsOnDate, upcoming: eventsAfterDate};

    res.status(200).json({ events });
  } catch (error) {
      next(error);
  }
}

exports.updateEventAvailability = async (req, res, next) => {
  try {
    const {eventId, userId, status} = req.body;
    const [availability, _] = await Event.updateUserAvailability(eventId, userId, status);
    res.status(200).json({ event: {id: eventId, availability: status}});
  } catch (error) {
      next(error);
  }
}

exports.createEvent = async (req, res, next) => {
    try {
      let { type, date, timeTBD, startTime, endTime, locationId, locationDetails = null, authorId, notes, status, notifyTeam, opponent = null, jersey, arriveEarly = null, teamId } = req.body;

      const newEvent = new Event(type, dateFormat.dateTime(date), timeTBD, startTime, endTime, locationId, locationDetails, authorId, notes, status, notifyTeam, opponent, jersey, arriveEarly, teamId);
      const [event, _] = await newEvent.save();
      console.log("Joell event", event);
      const [players, __] = await Team.findAllPlayers(teamId);
      console.log("Joell players", players);
      await newEvent.saveAvailability(event.insertId, players);
      console.log("Joell newEvent", newEvent)
      res.status(200).json({event: {...newEvent, id: event.insertId, availability: null} })
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