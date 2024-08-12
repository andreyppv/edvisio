import { validateEmail } from "../../../../../utils/validators/email";
import { validatePassword } from "../../../../../utils/validators/password";

export const validate = (form) => {
  const newForm = { ...form };
  let isValid = true;

  Object.keys(newForm).forEach((key) => {
    if (newForm[key].required) {
      if (newForm[key].value.length < 1) {
        newForm[key].message = "This field is required";
        isValid = false;
      } else if (key === "email") {
        if (!validateEmail(newForm?.email?.value)) {
          isValid = false;
          newForm.email.message = "enter a valid email";
        }
      } else if (key === "password" || key === "rePassword") {
        const [isPasswordValid, passwordMessage, rePasswordMessage] =
          validatePassword({
            password: newForm.password.value,
          });
        if (!isPasswordValid) {
          isValid = false;
          if (passwordMessage) newForm.password.message = passwordMessage;
          else if (rePasswordMessage)
            newForm.rePassword.message = rePasswordMessage;
          else newForm.password.message = "enter a valid password";
        }
      }
    }
  });

  return [isValid, newForm];
};
