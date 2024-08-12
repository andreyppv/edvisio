import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useForm } from "../../../../../hooks/form-control";
import { renderFields, initForm } from "./config";
import { validate } from "./validate";
import { mockRequest } from "../../../../../utils/mockRequest";
import SubmitButton from "../../../../molecules/Buttons/SubmitButton";
import { LinkButton } from "../../../../atoms/Buttons/Regular";
import { routes } from "../../../../../routes/Borrower/routes";
import { H3 as Heading } from "../../../../atoms/Typography";

const Wrapper = styled.div`
  padding: 50px 0 50px 60px;
  max-width: 430px;
  width: 100%;
  background: #fff;

  .heading {
    margin-bottom: 68px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 24px;

    & .buttons-wrapper {
      display: flex;
      gap: 24px;
      justify-content: center;
    }

    & .contained {
      width: 100px;
    }
  }
`;

const SignIn = () => {
  const { form, setForm, onChangeHandler } = useForm(initForm());
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const [isValid, updatedForm] = validate(form);
    if (isValid) {
      setLoading(true);
      await mockRequest();
      setLoading(false);
      history.push(routes.PORTAL);
    } else {
      setForm(updatedForm);
    }
  };

  return (
    <Wrapper className="singIn-wrapper">
      <Heading className="heading">Already have an account? Log In</Heading>
      <form onSubmit={onSubmit}>
        {renderFields(form).map(({ component: Component, ...field }) => {
          return (
            <div className="form-field" key={field.name}>
              <Component {...field} onChange={onChangeHandler} />
            </div>
          );
        })}
        <div className="buttons-wrapper">
          <LinkButton to={routes.FORGOT_PASSWORD} className="text">
            forgot password?
          </LinkButton>
          <SubmitButton type="submit" className="contained" loading={loading}>
            LOG IN
          </SubmitButton>
        </div>
      </form>
    </Wrapper>
  );
};

export default SignIn;
