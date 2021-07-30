const db = require('../config/db');

class Announcement {
    constructor(title, description, authorId, teams) {
        this.title = title;
        this.description = description;
        this.authorId = authorId;
        this.teams = teams;
    }

    async save() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth + 1;
        let day = d.getDate();
        let hours = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        let dateTimeStr = `${ year }-${ month }-${ day } ${ hours }:${ min }:${ sec }`;

        let sql = `
            INSER INTO ANNOUNCEMENTS (
                date,
                title,
                description,
                authorId,
                teams
            )
            VALUES (
                '${ dateTimeStr }',
                '${ this.title }',
                '${ this.description }',
                '${ this.authorId }',
                '${ this.teams }',
            )
        `;
        const [newAnnouncement, _] = await db.execute(sql);
        return newAnnouncement;
    }


}

module.exports = Announcement;
