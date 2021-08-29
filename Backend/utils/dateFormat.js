exports.dateTime = date => {
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    return `${ year }-${ month }-${ day } ${ hours }:${ min }:${ sec }`;
};