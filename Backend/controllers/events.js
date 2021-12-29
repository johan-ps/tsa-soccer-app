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
    const [availabilities, __] = await Event.findPlayerAvailabilities(id);
    res.status(200).json({ event, availabilities });
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
    const {date, userId} = req.query;
    let eventDate = new Date(date);
    eventDate = dateFormat.dateTime(eventDate);
    const [events, _] = await Event.findByDate(eventDate, userId);
    res.status(200).json({ events });
  } catch (error) {
      next(error);
  }
}

exports.getEventsFromDate = async (req, res, next) => {
  try {
    const {date, userId} = req.query;
    let eventDate = new Date(date);
    eventDate = dateFormat.dateTime(eventDate);
    const [eventsOnDate, _] = await Event.findByDate(eventDate, userId);
    const [eventsAfterDate, __] = await Event.findFromDate(eventDate, userId);
    for(let event of eventsAfterDate){
      const [availabilities, ___] = await Event.findPlayerAvailabilities(event.id);
      event.availabilities = availabilities;
    }
    const events = {today: eventsOnDate, upcoming: eventsAfterDate};

    res.status(200).json({ events });
  } catch (error) {
      next(error);
  }
}

exports.getAllEventDatesForMonth = async (req, res, next) => {
  try {
    const {startOfMonth, endOfMonth} = req.query;
    const [dates, _] = await Event.findAllEventDatesForMonth(dateFormat.dateTime(new Date(startOfMonth)), dateFormat.dateTime(new Date(endOfMonth)));
    res.status(200).json({ dates });
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
      let isValid = true, errors = [];

      if (!type || type.length === 0) {
          isValid = false;
          errors.push({
              errCode: '0001',
              field: 'type',
          });
      }
      if (!date || date.length === 0) {
          isValid = false;
          errors.push({
              errCode: '0002',
              field: 'date',
          });
      }

      if (!startTime || startTime.length === 0) {
        isValid = false;
        errors.push({
            errCode: '0002',
            field: 'startTime',
        });
      }

      if (!endTime || endTime.length === 0) {
        isValid = false;
        errors.push({
            errCode: '0002',
            field: 'startTime',
        });
      }

      const startTimeDate = new Date('2021-05-15T' + startTime);
      const endTimeDate = new Date('2021-05-15T' + endTime);
      if(startTimeDate.getTime() > endTimeDate.getTime()){
        isValid = false;
        errors.push({
            errCode: '0004',
            field: 'startTime',
        });
      }

      if (!locationId) {
        isValid = false;
        errors.push({
            errCode: '0002',
            field: 'locationId',
        });
      }

      if (!authorId) {
        isValid = false;
        errors.push({
            errCode: '0002',
            field: 'authorId',
        });
      }
      if (!teamId) {
        isValid = false;
        errors.push({
            errCode: '0002',
            field: 'teamId',
        });
      }

      if (isValid) {
        const newEvent = new Event(type, dateFormat.dateTime(date), timeTBD, startTime, endTime, locationId, locationDetails, authorId, notes, status, notifyTeam, opponent, jersey, arriveEarly, teamId);
        const [event, _] = await newEvent.save();
        const [players, __] = await Team.findAllPlayers(teamId);
        await newEvent.saveAvailability(event.insertId, players);
        res.status(200).json({event: {...newEvent, id: event.insertId, availability: null} })
      }
      else{
        res.status(400).json({ errors: errors });
      }
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
    let { id } = req.params;
    await Event.deleteAvailabilities(id);
    await Event.deleteEvents(id);
    res.status(200).json({ success: true, id: id})
  }
  catch(error){
    next(error);
  }
}