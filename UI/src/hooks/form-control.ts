import { useState } from "react";

export const useForm = (initForm: any) => {
  const [form, setForm] = useState(initForm);

  const onChangeHandler = (e: any) => {
    const { value, name } = e.target;
    setForm((prevState: any) => ({
      ...prevState,
      [name]: { ...prevState[name], value, message: "" },
    }));
  };

  return { form, setForm, onChangeHandler };
};
