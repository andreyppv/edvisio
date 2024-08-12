export const validate = (form) => {
  const newForm = { ...form };
  let isValid = true;
  Object.keys(form).forEach((key) => {
    if (newForm[key].required) {
      if (!newForm[key].value.trim()) {
        isValid = false;
        newForm[key].message = "This field is required";
      }
    }
  });

  return [isValid, newForm];
};
