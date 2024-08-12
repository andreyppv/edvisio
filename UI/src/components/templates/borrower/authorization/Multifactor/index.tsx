import React, { useState } from "react";
import styled from "styled-components";
import { initForm } from "./config";
import { useForm } from "../../../../../hooks/form-control";
import { validateEmail } from "../../../../../utils/validators/email";
import CodeForm from "./CodeForm";
import { H3 as Heading, Text } from "../../../../atoms/Typography";
import EmailForm from "./EmailForm";
import { mockRequest } from "../../../../../utils/mockRequest";
import Completed from "./Completed";

const Wrapper = styled.div`
  padding: 50px 60px 50px 0;
  background: var(--color-bg-2);
  display: flex;
  flex-direction: column;

  .heading,
  .subheading {
    color: var(--color-primary-green-1);
  }

  .form-wrapper {
    display: flex;
    flex-direction: column;
    gap: 68px;
    flex-grow: 1;

    & .textField {
      max-width: 320px;
    }

    & .submit-btn {
      width: 120px;
      margin-top: auto;
    }

    & .form-heading {
      color: var(--color-primary-dark-1);
    }
  }

  .subheading {
    margin: 12px 0 64px;
  }
`;

const renderForm = ({ page, formProps, onSubmitEmail, onSubmitCode }: any) => {
  switch (page) {
    case 1:
      return <EmailForm {...formProps} onSubmit={onSubmitEmail} />;
    case 2:
      return <CodeForm {...formProps} onSubmit={onSubmitCode} />;
    case 3:
      return <Completed />;
    default:
      return <></>;
  }
};

const Multifactor = () => {
  const [page, setPage] = useState(1);
  const { form, setForm, onChangeHandler } = useForm(initForm());
  const [loading, setLoading] = useState(false);

  const setErrorMessage = (name: string, message: string) => {
    setForm((prevState: any) => ({
      ...prevState,
      [name]: { ...prevState[name], message },
    }));
  };

  const onSubmitEmail = async () => {
    const emailIsValid = validateEmail(form.email.value);
    if (emailIsValid) {
      setPage(2);
    } else {
      setErrorMessage("email", "Enter a valid email");
    }
  };

  const onSubmitCode = async () => {
    if (form.code.value.length < 4) {
      setErrorMessage("code", "Enter a valid code");
    } else {
      setLoading(true);
      await mockRequest();
      setPage(3);
      setLoading(false);
    }
  };

  const formProps = {
    form,
    loading,
    onChange: onChangeHandler,
  };

  return (
    <Wrapper>
      <Heading className="heading">Create Account</Heading>
      <Text className="subheading">
        If registering to complete an application that has been started by your
        school, enter all information to match exactly what your school entered
        previously.
      </Text>
      {renderForm({ page, formProps, onSubmitCode, onSubmitEmail })}
    </Wrapper>
  );
};

export default Multifactor;
