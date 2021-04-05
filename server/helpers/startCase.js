module.exports = str =>
  str
    .toLowerCase()
    .split(' ')
    .map(letter => letter.charAt(0).toUpperCase() + letter.slice(1))
    .join(' ');
