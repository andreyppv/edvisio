import { isDateInFuture } from "../../../../../../utils/validators/date";

export const validateCalculation = (form) => {
  const newForm = { ...form };
  let isValid = true;
  Object.keys(form).forEach((key) => {
    if (newForm[key].required) {
      if (key === "graduationDate") {
        const { message } = isDateInFuture(newForm[key].value);
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
