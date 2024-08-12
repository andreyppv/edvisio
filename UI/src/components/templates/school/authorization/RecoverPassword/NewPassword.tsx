import React, { useState } from "react";
import styled from "styled-components";
import { H3, Text } from "../../../../atoms/Typography";
import { Button } from "../../../../atoms/Buttons/Regular";
import { initForm, renderFields } from "./config";
import { validatePassword } from "../../../../../utils/validators/password";
import { header, main, container } from "../styles";

const Wrapper = styled.div`
  ${header}
  ${main}  
  ${container}

  form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
`;

const NewPassword = ({ nextPage }: any) => {
  const [form, setForm] = useState(initForm());

  const onChange = (e: any) => {
    const { value, name } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: { value, message: "" } }));
  };

  const onSubmit = () => {
    const [isValid, passwordMessage, rePasswordMessage] = validatePassword({
      password: form.password.value,
      rePassword: form.rePassword.value,
    });
    if (isValid) {
      nextPage();
    } else {
      setForm((prevState: any) => ({
        password: { ...prevState.password, message: passwordMessage },
        rePassword: { ...prevState.rePassword, message: rePasswordMessage },
      }));
    }
  };

  return (
    <Wrapper>
      <H3 className="heading">Create New Password</H3>
      <Text className="subtitle">
        Please create and confirm your new password.
      </Text>
      <form className="container">
        {renderFields(form).map(({ component: Component, ...field }) => {
          return (
            <div className="form-field" key={field.name}>
              <Component {...field} onChange={onChange} />
            </div>
          );
        })}
        <Button type="button" className="contained" onClick={onSubmit}>
          confirm
        </Button>
      </form>
    </Wrapper>
  );
};

export default NewPassword;
