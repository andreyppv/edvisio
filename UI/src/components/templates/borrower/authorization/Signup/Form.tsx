import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import SubmitButton from "../../../../molecules/Buttons/SubmitButton";
import { useForm } from "../../../../../hooks/form-control";
import { initForm, renderFields } from "./config";
import { validate } from "./validate";
import { mockRequest } from "../../../../../utils/mockRequest";
import { routes } from "../../../../../routes/Borrower/routes";

const Form = styled.form`
  & .fields-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;

    & .textField:nth-child(3),
    & .textField:nth-child(4) {
      grid-column: 1 / -1;
    }
  }

  & .contained {
    width: 115px;
  }

  & .password-note {
    padding: 10px;
    margin-bottom: 14px;
    max-width: 290px;
    font-size: 12px;
    color: var(--color-gray-2);

    & ul {
      padding-left: 20px;
      margin-top: 10px;
    }
  }
`;

const PasswordNote = () => {
  return (
    <div className="password-note">
      <p className="note">
        Your password must include next indication of level of strength:
      </p>
      <ul>
        <li>Password cannot include your Email;</li>
        <li>Password have to include capital letters;</li>
        <li>Password have to include numbers;</li>
        <li>Password have to include additional symbols (!@##$%^&*());</li>
        <li>Minimal amount of numbers - 6;</li>
        <li>Maximum amount of numbers - 15.</li>
      </ul>
    </div>
  );
};

const FormComponent = () => {
  const { form, setForm, onChangeHandler } = useForm(initForm());
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const [isValid, updatedForm] = validate(form);
    if (isValid) {
      setLoading(true);
      await mockRequest();
      history.push(routes.VERIFICATION);
    } else {
      setForm(updatedForm);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <div className="fields-wrapper">
        {renderFields(form).map(({ component: Component, ...field }) => {
          return (
            <Component {...field} key={field.name} onChange={onChangeHandler} />
          );
        })}
      </div>
      <PasswordNote />
      <SubmitButton loading={loading} type="submit" className="contained">
        register
      </SubmitButton>
    </Form>
  );
};
export default FormComponent;
