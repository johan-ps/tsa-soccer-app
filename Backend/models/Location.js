const db = require('../config/db');

class Location {
    constructor(name, street, city, province, postalCode, country, latitude, longitude) {
        this.name = name; //string
        this.street = street; //string
        this.city = city; //string
        this.province = province; //string
        this.postalCode = postalCode; //sring
        this.country = country; //string
        this.latitude = latitude; //float
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
            INSERT INTO LOCATIONS (
                name,
                street,
                city,
                province,
                postalCode,
                country,
                latitude,
                longitude
            )
            VALUES (
                '${ this.name }',
                '${ this.street }',
                '${ this.city }',
                '${ this.province }',
                '${ this.postalCode }',
                '${ this.country }',
                '${ this.latitude }',
                '${ this.longitude }'
            );
        `;
        console.log("Joell sql", sql)
        return db.execute(sql);
    }

    static findAll() {
        const sql = 'SELECT * FROM LOCATIONS';

        return db.execute(sql);
    }

    static findById(id) {
        const sql = `SELECT * FROM LOCATIONS WHERE id = ${id}`;

        return db.execute(sql);
    }

    static updateById(id) {

    }

    static deleteById(id){
        const sql = `DELETE FROM LOCATIONS WHERE id = '${id}'`;

        return db.execute(sql);
    }

}

module.exports = Location;
