const db = require('../config/db');

class Team {
    constructor(name, ageGroup) {
        this.name = name; //string
        this.ageGroup = ageGroup; //int
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
                ageGroup
            )
            VALUES (
                '${ this.name }',
                '${ this.ageGroup }'
            );
        `;
        console.log('Joell sql', sql)
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

}

module.exports = Team;
