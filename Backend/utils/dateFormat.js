exports.dateTime = (date, includeTime = true, start = false) => {
    const padZero = (val, dec = 2) => {
        let str = val.toString();
        if (str.length === 0) {
            return '00'
        } else if (str.length === 1) {
            return `0${str}`
        }
        return str;
    }

    date = new Date(date);
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const min = padZero(date.getMinutes());
    const sec = padZero(date.getSeconds());

    if (includeTime) {
        return `${ year }-${ month }-${ day } ${ hours }:${ min }:${ sec }`;
    } else {
        return `${ year }-${ month }-${ day } ${start ? '00:00:00' : '11:59:99'}`;
    }
};