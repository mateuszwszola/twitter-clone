const _ = require('lodash');

module.exports = id => {
  const idErrors = {};

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    // id is not valid ObjectId, findOne with this value will cause an error
    idErrors.objectid = `ID ${id} is not a valid ObjectId`;
  }

  return {
    idErrors,
    isValid: _.isEmpty(idErrors)
  };
};
