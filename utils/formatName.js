// Make name first letter uppercase and the rest lowercase
module.exports = name => {
  // if name consists of more than 1 word capitalize first letter in each part of the name
  if (name.split(' ').length > 1) {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return name;
};
