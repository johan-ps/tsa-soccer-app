const db = require('../config/db');

class User {
    constructor(username, password, firstName, lastName, profileImg, email, role, position, phoneNum, accessLevel) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profileImg = profileImg;
        this.email = email;
        this.role = role;
        this.position = position;
        this.phoneNum = phoneNum;
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
                email,
                role,
                position,
                phoneNum,
                accessLevel
            )
            VALUES (
                '${ this.username }',
                '${ this.password }',
                '${ this.firstName }',
                '${ this.lastName }',
                '${ this.profileImg }',
                '${ this.email }',
                '${ this.role }',
                '${ this.position }',
                '${ this.phoneNum }',
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
        let sql = `SELECT * FROM USERS WHERE username = '${ username }' LIMIT 1`;

        return db.execute(sql);
    }

    static findOneById(id) {
        let sql = `SELECT * FROM USERS WHERE id = '${ id }' LIMIT 1`;

        return db.execute(sql);
    }

    static findAllTeams(id){
      let sql = `SELECT teamId FROM TEAMS_USERS WHERE userId = ${id}`;

      return db.execute(sql);
    }

    static updateOneById(id, data) {
        const { firstName, lastName, profileImg = null, phoneNum, email } = data;

        let imageInsert = '';

        if (profileImg !== null) {
            imageInsert = `profileImg = '${profileImg}',`;
        }

        const sql = `
            UPDATE USERS
            SET firstName = '${firstName}',
                lastName = '${lastName}',
                ${imageInsert}
                phoneNum = '${phoneNum}',
                email = '${email}'
            WHERE id = '${id}'
        `;

        return db.execute(sql);
    }


}

module.exports = User;
