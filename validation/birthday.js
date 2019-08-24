const { toDate, isAfter } = require('validator');
const { isDate } = require('lodash');

module.exports = function(value) {
    const birthday = toDate(value);
    if (!isDate(birthday)) {
        throw new Error('Birthday must be a valid date');
    }

    const prependWithZero = value => value < 10 ? '0' + value : value;
    const date = new Date();
    const year = date.getFullYear();
    const month = prependWithZero(date.getMonth() + 1);
    const day = prependWithZero(date.getDate());
    const minDate = `${year - 13}-${month}-${day}`;

    if (isAfter(birthday, minDate)) {
        throw new Error('You must be at least 13 years old');
    }

    return true;
};