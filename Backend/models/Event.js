const db = require('../config/db');

class Event {
  constructor(type, title, eventDate, timeTbd, startTime, endTime, locationId, authorId, teams, extraNotes, cancelled, notifyTeam, opponent, locationDetails, jersey, homeOrAway, arriveEarly, repeats) {
    this.type = type; // enum: One of Game/Practice/Other
    this.title = title; // string
    this.eventDate = eventDate; // date
    this.timeTbd = timeTbd; // boolean
    this.startTime = startTime; // time
    this.endTime = endTime; // time
    this.locationId = locationId; // id
    this.locationDetails = locationDetails; // string
    this.authorId = authorId; // id
    this.teams = teams; // array of UserIds
    this.going = going; // array of UserIds
    this.maybe = maybe; // array of UserIds
    this.unavailable = unavailable; // array of UserIds
    this.noResponse = noResponse; // array of UserIds
    this.extraNotes = extraNotes; // string
    this.cancelled = cancelled; // boolean
    this.notifyTeam = notifyTeam; // boolean
    this.opponent = opponent; // string
    this.jersey = jersey; // (color) string?
    this.homeOrAway = homeOrAway; // boolean
    this.arriveEarly = arriveEarly; // boolean
    this.repeats = repeats; // enum (Mon, Tues, Wed, Thurs, Fri, Sat, Sun)
}

save() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  const dateTimeStr = `${ year }-${ month }-${ day } ${ hours }:${ min }:${ sec }`;

  const sql = `
      INSERT INTO EVENTS (
        type, 
        title, 
        eventDate, 
        timeTdb, 
        startTime, 
        endTime, 
        locationId, 
        authorId, 
        teams, 
        extraNotes, 
        cancelled, 
        notifyTeam, 
        opponent, 
        locationDetails, 
        jersey, 
        homeOrAway, 
        arriveEarly, 
        repeats,
        created_at
      )
      VALUES (
          '${ this.type }',
          '${ this.title }',
          '${ this.eventDate }',
          '${ this.timeTbd }',
          '${ this.startTime }',
          '${ this.endTime }',
          '${ this.locationId }',
          '${ this.authorId }',
          '[${ this.teams }]',
          '${ this.extraNotes }',
          '${ this.cancelled }',
          '${ this.notifyTeam }',
          '${ this.opponent }',
          '${ this.locationDetails }',
          '${ this.jersey }',
          '${ this.homeOrAway }',
          '${ this.arriveEarly }',
          '${ this.repeats }'
      );
  `;
  return db.execute(sql);
}

static findAll() {
  const sql = 'SELECT * FROM EVENTS';

  return db.execute(sql);
}

static findById(id) {
  const sql = `SELECT * FROM EVENTS WHERE ID = ${id}`;

  return db.execute(sql)
}

static findByTeam(teamId) {

  // TODO : make sure this is right
  const sql = `SELECT e.event_id, type FROM TEAMS et INNER JOIN EVENTS e ON e.event_id = et.event_id WHERE et.team_id = ${teamId}`;

  return db.execute(sql);
}

static findByDate(date) {
  const sql = `SELECT type, title, eventDate, timeTbd, startTime, endTime, l.id, l.title, l.address, opponent FROM EVENTS WHERE EVENT_DATE = ${new Date(date)}`;

  return db.execute(sql);
}

static findFromDate(date){
  const sql =  `SELECT type, title, eventDate, timeTbd, startTime, endTime, l.id, l.title, opponent FROM EVENTS WHERE EVENT_DATE > ${new Date(date)}`;

  return db.execute(sql);
}


}

module.exports = Event;
