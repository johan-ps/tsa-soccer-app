const db = require('../config/db');
const { isAuth } = require('../middleware/auth');

class Event {
  constructor(type, date, timeTBD, startTime, endTime, locationId, locationDetails, authorId, notes, status, notifyTeam, opponent, jersey, arriveEarly, teamId) {
    this.type = type; // string
    this.date = date; // date
    this.timeTBD = timeTBD; // boolean
    this.startTime = startTime; // time
    this.endTime = endTime; // time
    this.locationId = locationId; // id
    this.locationDetails = locationDetails; // string
    this.authorId = authorId; // id
    this.notes = notes; // string
    this.status = status; // boolean
    this.notifyTeam = notifyTeam; // boolean
    this.opponent = opponent; // string
    this.jersey = jersey; // (color) string?
    this.arriveEarly = arriveEarly; // boolean
    this.teamId = teamId; // boolean
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
        date, 
        timeTBD, 
        startTime, 
        endTime, 
        locationId, 
        locationDetails, 
        authorId, 
        notes, 
        status, 
        notifyTeam, 
        opponent, 
        jersey, 
        arriveEarly, 
        teamId
      )
      VALUES (
          '${ this.type }',
          '${ this.date }',
          '${ this.timeTBD }',
          '${ this.startTime }',
          '${ this.endTime }',
          '${ this.locationId }',
          '${ this.locationDetails }',
          '${ this.authorId }',
          '${ this.notes }',
          '${ this.status }',
          '${ this.notifyTeam }',
          '${ this.opponent }',
          '${ this.jersey }',
          '${ this.arriveEarly }',
          '${ this.teamId }'
      );
  `;
  return db.execute(sql);
}

saveAvailability(id, players) {
  let availabilityInsert = '';
  if(players){
    if(this.teamId){
      players.forEach((player, i) => {
        availabilityInsert += `('${ id }', '${ player.id }', NULL)`;

        if (i < players.length - 1) {
          availabilityInsert += ', '
      }
      });
    }

    const sql = `
        INSERT INTO AVAILABILITY (
            eventId,
            playerId,
            status
        )
        VALUES ${ availabilityInsert };
    `;
    return db.execute(sql);
  }
}

static updateUserAvailability(eventId, userId, status) {
  const sql = `
    UPDATE AVAILABILITY
    SET status = '${status}'
    WHERE playerId = '${userId}' AND eventId = '${eventId}';
  `;

  return db.execute(sql);
}


static findAll() {
  const sql = 'SELECT * FROM EVENTS';

  return db.execute(sql);
}

static findById(id) {
  const sql = `SELECT e.id, e.type, e.date, e.timeTBD, e.startTime, e.endTime, e.jersey, e.status, e.opponent, e.notes, e.teamId, l.name, l.street, l.city, l.province, l.postalCode, l.latitude, l.longitude FROM EVENTS e, LOCATIONS l WHERE e.ID = ${id} AND l.id = e.locationId`;
  return db.execute(sql)
}

static findByTeam(teamId) {

  // TODO : make sure this is right
  const sql = `SELECT e.event_id, type FROM TEAMS et INNER JOIN EVENTS e ON e.event_id = et.event_id WHERE et.team_id = '${teamId}'`;

  return db.execute(sql);
}

static findByDate(date, userId) {
  let sql = '';
  console.log("Joell userId", userId);
  if(userId !== 'undefined' && userId !== undefined){
    sql = `SELECT e.id, e.type, e.date, e.timeTBD, e.startTime, e.endTime, e.status, e.opponent, e.teamId, l.name, a.status FROM EVENTS e, LOCATIONS l, AVAILABILITY a WHERE e.date = '${date}' AND l.id = e.locationId AND a.playerId = ${userId} AND a.eventId = e.id ORDER BY startTime ASC`;
  }
  else{
    sql = `SELECT e.id, e.type, e.date, e.timeTBD, e.startTime, e.endTime, e.status, e.opponent, e.teamId, l.name FROM EVENTS e, LOCATIONS l WHERE e.date = '${date}' AND l.id = e.locationId ORDER BY startTime ASC`;
  }
  console.log("Joell sql", sql);

  return db.execute(sql);
}

static findFromDate(date, userId){
  let sql = '';
  if(userId !== 'undefined' && userId !== undefined){
    sql =  `SELECT e.id, e.type, e.date, e.timeTBD, e.startTime, e.endTime, e.opponent, e.status, a.status FROM EVENTS e, AVAILABILITY a WHERE a.playerId = ${userId} AND a.eventId = e.id AND e.date > '${date}' ORDER BY date ASC LIMIT 10`;
  }
  else{
    sql =  `SELECT id, type, date, timeTBD, startTime, endTime, opponent, status FROM EVENTS WHERE date > '${date}' ORDER BY date ASC LIMIT 10`;
  }

  return db.execute(sql);
}
// TODO: fix query
static findAllEventDatesForMonth(startOfMonth, endOfMonth){
  const sql = `SELECT date from EVENTS WHERE date >= '${startOfMonth}' AND date <= '${endOfMonth}';`; 
  console.log("Joell sql", sql);
  return db.execute(sql);
}

static deleteById(id){
  const sql = `DELETE FROM EVENTS WHERE id = '${id}';`;

  return db.execute(sql);
}


}

module.exports = Event;
