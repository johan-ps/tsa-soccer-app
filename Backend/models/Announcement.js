const db = require('../config/db');
const dateFormat = require('../utils/dateFormat');

class Announcement {
    constructor(title, description, authorId, teams, image) {
        this.title = title;
        this.description = description;
        this.authorId = authorId;
        this.teams = teams;
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
                authorId
                ${ imageInsert }
            )
            VALUES (
                '${ dateTimeStr }',
                '${ this.title }',
                '${ this.description }',
                '${ this.authorId }'
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

                if (i < this.teams.length - 1) {
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
        
        return db.execute(sql);
    }

    static findAll() {
        const sql = `
            SELECT
                firstName, lastName, profileImg,
                title, description, image, date, a.id, authorId
            FROM ANNOUNCEMENTS as a 
            INNER JOIN USERS as u
                ON authorId = u.id 
                ORDER BY date DESC
        `;

        return db.execute(sql);
    }

    static findAllByTeams(teams) {

        let teamsSql = '(';
        teams.forEach((team, i) => {
            teamsSql += `'${team}'`

            if (i < teams.length - 1) {
                teamsSql += ', '
            }
        });
        if (teams.length === 0) {
            teamsSql += `''`
        }
        teamsSql += ')'

        const sql = `
            SELECT
                firstName, lastName, profileImg,
                title, description, image, date, a.id, authorId
            FROM ANNOUNCEMENTS as a 
            INNER JOIN USERS as u
                ON authorId = u.id
            INNER JOIN ANNOUNCEMENTS_TEAMS as at
                ON at.announcementId = a.id
            WHERE at.teamId in ${ teamsSql }
        `;
        
        return db.execute(sql);
    }

    static findOneByIdAndUpdate() {
        const sql = '';
    }


}

module.exports = Announcement;
