const db = require('../config/db');

class Team {
    constructor(title, ageGroup, players, coaches) {
        this.title = title; //string
        this.ageGroup = ageGroup; //int
        this.players = players; //array of user ids
        this.coaches = coaches; //array of user ids
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
                title,
                ageGroup,
                players,
                coaches,
                createdAt
            )
            VALUES (
                '${ this.title }',
                '${ this.ageGroup }',
                '[${ this.players }]'
                '[${ this.coaches }]'
                '${ dateTimeStr }'
            );
        `;
        return db.execute(sql);
    }

    static findAll() {
        const sql = 'SELECT * FROM TEAM';

        return db.execute(sql);
    }

}

module.exports = Team;
