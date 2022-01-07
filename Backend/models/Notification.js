const db = require('../config/db');

class Notification {
    constructor(userId, addPrefs, removePrefs) {
        this.userId = userId;
        this.addPrefs = addPrefs;
        this.removePrefs = removePrefs;
    }

    async update() {
        if (this.addPrefs.length > 0) {
            await this.addPreferences(this.addPrefs, this.userId);
        }
        
        if (this.removePrefs.length > 0) {
            await this.removePreferences(this.removePrefs, this.userId)
        }
    }

    addPreferences(preferences, userId) {
        const sql = `
            INSERT INTO NOTIFICATION (userId, preference)
            VALUES ?;
        `;

        const values = preferences.map(pref => {
            return [userId, pref]
        });

        return db.query(sql, [values])
    }

    removePreferences(preferences, userId) {
        const sql = `
            DELETE
            FROM NOTIFICATION
            WHERE userId = ? and preference IN (?);
        `;

        return db.query(sql, [userId, preferences])
    }

    static getPreferences(userId) {
        const sql = `
            SELECT preference
            FROM NOTIFICATION
            WHERE userId = ?;
        `;

        return db.execute(sql, [userId]);
    }
}

module.exports = Notification;
