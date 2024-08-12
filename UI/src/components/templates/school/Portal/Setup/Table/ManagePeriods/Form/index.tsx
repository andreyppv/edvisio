import React, { useState } from "react";
import { useForm } from "../../../../../../../../hooks/form-control";
import { initForm } from "./config";
import { validate } from "./validation";
import { mockRequest } from "../../../../../../../../utils/mockRequest";
import FormComponent from "./UI";
import { parseFormToFormat } from "../../../../../../../../utils/form/parsers";

const Form = ({ cb, closeModal, formData }: any) => {
  const isEditing = !!formData;
  const { form, setForm, onChangeHandler } = useForm(initForm(formData || {}));
  const [isPassword, setIsPassword] = useState(!isEditing);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    const [isValid, updatedForm] = validate(form, isPassword);
    if (isValid) {
      setLoading(true);
      const parsedForm = parseFormToFormat(updatedForm);
      delete parsedForm.rePassword;
      await mockRequest(parsedForm);
      cb();
      setLoading(false);
      closeModal();
    } else {
      setForm(updatedForm);
    }
  };

  const formProps = {
    onSubmitHandler,
    onChangeHandler,
    form,
    setIsPassword,
    closeModal,
    isPassword,
    loading,
    setForm,
    isEditing,
  };

  return <FormComponent {...formProps} />;
};

export default Form;
