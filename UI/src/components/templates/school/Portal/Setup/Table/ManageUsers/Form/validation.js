import { validatePassword } from "../../../../../../../../utils/validators/password";

export const validate = (form, isPassword) => {
  let isValid = true;
  const newForm = { ...form };

  Object.keys(newForm).forEach((key) => {
    if (newForm[key].required) {
      if (key === "password" || key === "rePassword") {
        if (isPassword) {
          const [isPasswordValid, passwordMessage, rePasswordMessage] =
            validatePassword({
              password: newForm.password.value,
              rePassword: newForm.rePassword.value,
            });
          if (!isPasswordValid) {
            if (passwordMessage) {
              newForm.password.message = passwordMessage;
              isValid = false;
            }
            if (rePasswordMessage) {
              newForm.rePassword.message = rePasswordMessage;
              isValid = false;
            }
          }
        }
      } else if (!newForm[key].value.toString().trim().length) {
        newForm[key].message = "This field is required";
        isValid = false;
      }
    }
  });

  return [isValid, newForm];
};
