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
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();
        const dateTimeStr = `${ year }-${ month }-${ day } ${ hours }:${ min }:${ sec }`;

        let imageInsert = '';
        let imageData = '';

        if (this.image !== null) {
            imageInsert = ', image'
            imageData = `, '${ this.image }'`
        }

        const sql = `
            INSERT INTO ANNOUNCEMENTS (
                date,
                title,
                description,
                authorId,
                teams
                ${ imageInsert }
            )
            VALUES (
                '${ dateTimeStr }',
                '${ this.title }',
                '${ this.description }',
                '${ this.authorId }',
                '[${ this.teams }]'
                ${ imageData }
            );
        `;
        return db.execute(sql);
    }

    static findAll() {
        const sql = 'SELECT * FROM ANNOUNCEMENTS';

        return db.execute(sql);
    }

    static findOneByIdAndUpdate() {
        const sql = '';
    }


}

module.exports = Announcement;
