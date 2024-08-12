import React, { useState } from "react";
import styled from "styled-components";
import { H3, Text } from "../../../../atoms/Typography";
import { Button } from "../../../../atoms/Buttons/Regular";
import EmailField from "../../../../molecules/Controllers/Email/EmailField";
import { validateEmail } from "../../../../../utils/validators/email";
import { header, main, container } from "../styles";

const Wrapper = styled.div`
  ${header}
  ${main}  
  ${container}

  form {
    display: flex;
    flex-direction: column;
    gap: 24px;

    .form-field {
      &:nth-child(1),
      &:nth-child(2) {
        grid-column: 1 / -1;
      }
    }
  }
`;

const Email = ({ nextPage }: any) => {
  const [form, setForm] = useState({ email: { value: "", message: "" } });

  const onChange = (e: any) => {
    const { value, name } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: { value, message: "" } }));
  };

  const onSubmit = () => {
    if (validateEmail(form.email.value)) {
      nextPage();
    } else {
      setForm((prevState) => ({
        ...prevState,
        email: { ...prevState.email, message: "Enter a valid email" },
      }));
    }
  };

  return (
    <Wrapper>
      <H3 className="heading">Recover your Password</H3>
      <Text className="subtitle">
        Please, enter your email which is connected to your account.
      </Text>
      <form className="container">
        <EmailField
          value={form.email.value}
          message={form.email.message}
          name="email"
          label="Enter Email"
          onChange={onChange}
        />

        <Button type="button" className="contained" onClick={onSubmit}>
          CONTINUE
        </Button>
      </form>
    </Wrapper>
  );
};

export default Email;
