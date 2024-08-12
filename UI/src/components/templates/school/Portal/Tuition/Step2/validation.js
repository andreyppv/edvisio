import {
  validateZipCode,
  validatePhone,
} from "../../../../../../utils/validators/other";

export const validate = (form) => {
  const newForm = { ...form };
  let isValid = true;
  Object.keys(form).forEach((key) => {
    if (newForm[key].required) {
      if (key === "zip") {
        const message = validateZipCode(newForm[key].value);
        if (message) {
          isValid = false;
          newForm[key].message = message;
        }
      }
      if (key === "phone") {
        const message = validatePhone(newForm[key].value);
        if (message) {
          isValid = false;
          newForm[key].message = message;
        }
      } else if (!newForm[key].value) {
        isValid = false;
        newForm[key].message = "This field is required";
      }
    }
  });

  return [isValid, newForm];
};
