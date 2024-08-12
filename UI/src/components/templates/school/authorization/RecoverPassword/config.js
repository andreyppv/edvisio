import Password from "../../../../molecules/Controllers/Password/Placeholder-label";

export const initForm = () => {
  return {
    password: { value: "", message: "" },
    rePassword: { value: "", message: "" },
  };
};

export const renderFields = (form) => [
  {
    value: form.password.value,
    message: form.password.message,
    name: "password",
    component: Password,
    label: "Create new password",
  },
  {
    value: form.rePassword.value,
    message: form.rePassword.message,
    name: "rePassword",
    component: Password,
    label: "Confirm new password",
  },
];
