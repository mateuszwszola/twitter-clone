// Validate form, check if the fields are not empty
function validateForm(data) {
  const fields = Object.keys(data);
  const errors = {};
  for (const field of fields) {
    if (!data[field].trim()) {
      if (field === 'password2') {
        errors[field] = `repeat password is required`;
      } else {
        errors[field] = `${field} is required`;
      }
    }
  }

  return errors;
}

export default validateForm;
