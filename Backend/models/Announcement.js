const db = require('../config/db');
const dateFormat = require('../utils/dateFormat');

class Announcement {
    constructor(title, description, authorId, teams, image) {
        this.title = title;
        this.description = description;
        this.authorId = authorId;
        this.teams = JSON.parse(teams);
        this.image = image;
    }

    save() {
        const dateTimeStr = dateFormat.dateTime(new Date());

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
                ${ imageInsert }
            )
            VALUES (
                '${ dateTimeStr }',
                '${ this.title }',
                '${ this.description }',
                '${ this.authorId }',
                ${ imageData }
            );
        `;

        return db.execute(sql);
    }

    saveTeams (id) {
        let teamsInsert = '';

        if (this.teams && this.teams.length > 0) {
            this.teams.forEach((team, i) => {
                teamsInsert += `('${ id }', '${ team }')`;

                if (i < this.teams.length) {
                    teamsInsert += ', '
                }
            });
        }

        const sql = `
            INSERT INTO ANNOUNCEMENTS_TEAMS (
                announcementId,
                teamId
            )
            VALUES ${ teamsInsert };
        `;
        console.log(sql)
        
        return db.execute(sql);
    }

    static findAll() {
        const sql = `
            SELECT a.title, a.description, a.authorId,
                u.profileImg, a.date,
                u.firstName, u.lastName, a.image, a.id
            FROM ANNOUNCEMENTS as a, USERS as u
            WHERE a.authorId = u.id
        `;

        return db.execute(sql);
    }

    static findOneByIdAndUpdate() {
        const sql = '';
    }


}

module.exports = Announcement;
