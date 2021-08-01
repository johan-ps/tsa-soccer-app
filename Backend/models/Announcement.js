const db = require('../config/db');

class Announcement {
    constructor(title, description, authorId, teams, image) {
        this.title = title;
        this.description = description;
        this.authorId = authorId;
        this.teams = teams;
        this.image = image;
    }

    save() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        let dateTimeStr = `${ year }-${ month }-${ day } ${ hours }:${ min }:${ sec }`;

        let sql = `
            INSERT INTO ANNOUNCEMENTS (
                date,
                title,
                description,
                authorId,
                teams,
                image
            )
            VALUES (
                '${ dateTimeStr }',
                '${ this.title }',
                '${ this.description }',
                '${ this.authorId }',
                '[${ this.teams }]',
                '${ this.image }'
            );
        `;

        return db.execute(sql);
    }

    static findAll() {
        let sql = 'SELECT * FROM ANNOUNCEMENTS';

        return db.execute(sql);
    }


}

module.exports = Announcement;
