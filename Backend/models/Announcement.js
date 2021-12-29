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

    update (id) {
        const dateTimeStr = dateFormat.dateTime(new Date());

        let imageUpdate = '';

        if (this.image !== null) {
            imageUpdate = `, image = '${ this.image }'`
        }

        const sql = `
            UPDATE ANNOUNCEMENTS
            SET date = '${ dateTimeStr }', description = '${ this.description }'${imageUpdate}
            WHERE id = ${ id };
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

    static findAllByFilters({ teams, startDate, endDate}) {

        let prevExists = false, filter = '';

        if (teams && teams.length > 0) {
            prevExists = true;
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
            filter = `
                INNER JOIN ANNOUNCEMENTS_TEAMS as at
                    ON at.announcementId = a.id
                WHERE at.teamId in ${ teamsSql }
            `
        }

        if (startDate) {
            let startDateFilter = `date(a.date) >= '${dateFormat.dateTime(new Date(startDate), false, true)}'`

            if (prevExists) {
                filter = `${filter} AND ${startDateFilter}`;
            } else {
                filter = `${filter} WHERE ${startDateFilter}`;
            }
            prevExists = true;
        }

        if (endDate) {
            let endDateFilter = `date(a.date) <= '${dateFormat.dateTime(new Date(endDate), false)}'`

            if (prevExists) {
                filter = `${filter} AND ${endDateFilter}`;
            } else {
                filter = `${filter} WHERE ${endDateFilter}`;
            }
            prevExists = true;
        }

        const sql = `
            SELECT
                firstName, lastName, profileImg,
                title, description, image, date, a.id, authorId
            FROM ANNOUNCEMENTS as a 
            INNER JOIN USERS as u
                ON authorId = u.id
            ${filter}
            GROUP BY a.id
        `;
        
        return db.execute(sql);
    }

    static deleteAnnouncements (id) {
        const sql = `
            DELETE
            FROM ANNOUNCEMENTS
            WHERE id = ${id};
        `;

        return db.execute(sql);
    }

    static deleteAnnouncementsTeams (id) {
        const sql = `
            DELETE
            FROM ANNOUNCEMENTS_TEAMS
            WHERE announcementId = ${id};
        `;

        return db.execute(sql);
    }

    static findTeams (id) {
        const sql = `
            SELECT teamId
            FROM ANNOUNCEMENTS_TEAMS as at
            WHERE at.announcementid = ${id};
        `;

        return db.execute(sql);
    }

    static getImage (id) {
        const sql = `
            SELECT image
            FROM ANNOUNCEMENTS as a
            WHERE a.id = ${id};
        `;

        return db.execute(sql);
    }


}

module.exports = Announcement;
