import isEmpty from './isEmpty';

// Validate form, check if the fields are not empty
function validateForm(data) {
  const errors = [];
  for (const field of Object.keys(data)) {
    if (!data[field].trim()) {
      if (field === 'password2') {
        errors.push({
          msg: `repeat password is required`,
          param: 'password2'
        });
      } else {
        errors.push({
          msg: `${field} is required`,
          param: field
        });
      }
    }
  }

  return isEmpty(errors) ? null : errors;
}

export default validateForm;
