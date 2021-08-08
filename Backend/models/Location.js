const db = require('../config/db');

class Location {
    constructor(title, ageGroup, players, coaches) {
        this.name = title; //string
        this.street = street; //street
        this.city = street; //city
        this.postalCode = street; //postalCode
        this.address = address; //string
        this.description = description //string
        this.latitutde = latitutde; //float
        this.longitude = longitude; //flaot

        // TODO: Find location required params
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

module.exports = Location;
