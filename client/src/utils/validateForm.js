import isEmpty from './isEmpty';

// Validate form, check if the fields are not empty
function validateForm(data) {
  const errors = {};
  for (const field of Object.keys(data)) {
    if (!data[field].trim()) {
      errors[field] = `${field} is required`;
    }
  }

  return isEmpty(errors) ? null : errors;
}

export default validateForm;
