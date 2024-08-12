import { validateDob } from "../../../../../../utils/validators/dob";
import { validateEmail } from "../../../../../../utils/validators/email";
import {
  validatePhone,
  validateSSNLastFour,
} from "../../../../../../utils/validators/other";

export const validateApplicationInfo = (form) => {
  const newForm = { ...form };
  let isValid = true;
  Object.keys(form).forEach((key) => {
    if (form[key].required) {
      if (key === "dob") {
        const message = validateDob(newForm.dob.value);
        if (message) {
          isValid = false;
          newForm.dob.message = message;
        }
      } else if (key === "phone") {
        const message = validatePhone(newForm[key].value);
        if (message) {
          isValid = false;
          newForm.phone.message = message;
        }
      } else if (key === "email") {
        const emailIsValid = validateEmail(newForm.email.value);
        if (!emailIsValid) {
          newForm.email.message = "Enter a valid email";
          isValid = false;
        }
      } else if (key === "ssn") {
        const message = validateSSNLastFour(newForm.ssn.value.trim());
        if (message) {
          isValid = false;
          newForm.ssn.message = message;
        }
      } else if (!newForm[key].value.trim().length) {
        isValid = false;
        newForm[key].message = "This field is required";
      }
    }
  });

  return [isValid, newForm];
};
