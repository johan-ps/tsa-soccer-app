const db = require('../config/db');

class User {
    constructor(username, passowrd, firstName, lastName, profileImg, teamId, email, role, position, phoneNumber, accessLevel) {
        this.username = username;
        this.passowrd = passowrd;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profileImg = profileImg;
        this.teamId = teamId;
        this.email = email;
        this.role = role;
        this.position = position;
        this.phoneNumber = phoneNumber;
        this.accessLevel = accessLevel;
    }

    save() {
        let sql = `
            INSERT INTO USERS (
                username,
                password,
                firstName,
                lastName,
                profileImg,
                teamId,
                email,
                role,
                position,
                phoneNumber,
                accessLevel
            )
            VALUES (
                '${ this.username }',
                '${ this.passowrd }',
                '${ this.firstName }',
                '${ this.lastName }',
                '${ this.profileImg }',
                '${ this.teamId }',
                '${ this.email }',
                '${ this.role }',
                '${ this.position }',
                '${ this.phoneNumber }',
                '${ this.accessLevel }'
            );
        `;

        return db.execute(sql);
    }

    static findAll() {
        let sql = 'SELECT * FROM USERS';

        return db.execute(sql);
    }

    static findOneByUsername(username) {
        let sql = `SELECT id, username, password FROM USERS WHERE username = '${ username }' LIMIT 1`;

        return db.execute(sql);
    }

    static findOneById(id) {
        let sql = `SELECT id, username, password FROM USERS WHERE id = '${ id }' LIMIT 1`;

        return db.execute(sql);
    }


}

module.exports = User;
