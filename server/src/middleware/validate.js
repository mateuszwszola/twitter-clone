const { validationResult } = require('express-validator');

const validate = (validationRules) => [
  validationRules(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }

    next();
  },
];

module.exports = validate;
