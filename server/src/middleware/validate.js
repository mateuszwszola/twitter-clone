const { validationResult } = require('express-validator');

const validate = (validationRules = []) => {
  if (typeof validationRules === 'function') {
    validationRules = validationRules();
  }

  if (!Array.isArray(validationRules)) {
    validationRules = [validationRules];
  }

  return [
    ...validationRules,
    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array({ onlyFirstError: true }) });
      }

      next();
    },
  ];
};

module.exports = validate;
