const db = require('../config/db');

class Team {
    constructor(name, ageGroup, type) {
        this.name = name; //string
        this.ageGroup = ageGroup; //int
        this.type = type; //int
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
            INSERT INTO TEAMS (
                name,
                ageGroup,
                type
            )
            VALUES (
                '${ this.name }',
                '${ this.ageGroup }',
                '${ this.type }'
            );
        `;
        
        return db.execute(sql);
    }

    static findAll() {
        const sql = 'SELECT * FROM TEAMS';

        return db.execute(sql);
    }

    static findById(id){
        const sql = `SELECT * FROM TEAMS WHERE id = ${id}`;
        console.log(sql);
        return db.execute(sql);
    }

    static findAllUsers(id){
      const sql = `SELECT u.id, u.firstName, u.lastName FROM USERS u, TEAMS_USERS tu WHERE u.id = tu.userId AND tu.teamId = ${id}`;

      return db.execute(sql);
    }

    static findAllCoaches(id) {
        const sql = `SELECT u.id, u.firstName, u.lastName FROM USERS u, TEAMS_USERS tu WHERE u.id = tu.userId AND tu.teamId = ${id} AND u.role = 'coach'`;

        return db.execute(sql);
    }

    static findAllPlayers(id) {
        const sql = `SELECT u.id, u.firstName, u.lastName FROM USERS u, TEAMS_USERS tu WHERE u.id = tu.userId AND tu.teamId = ${id} AND u.role = 'player'`;

        return db.execute(sql);
    }

    static deleteById(id){
        const sql = `DELETE FROM TEAMS WHERE id = '${id}'`;

        return db.execute(sql);
    }

}

module.exports = Team;
