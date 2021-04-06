const isEmpty = require('./is-empty');

module.exports = (id) => {
  const idErrors = {};

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    idErrors.objectid = `ID ${id} is not a valid ObjectId`;
  }

  return {
    idErrors,
    isValidObjectId: isEmpty(idErrors),
  };
};
