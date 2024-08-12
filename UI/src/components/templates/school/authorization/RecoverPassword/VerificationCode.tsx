import React, { useState } from "react";
import styled from "styled-components";
import { H3, Text } from "../../../../atoms/Typography";
import { Button } from "../../../../atoms/Buttons/Regular";
import Password from "../../../../molecules/Controllers/Password/Placeholder-label";
import { header, main, container } from "../styles";

const Wrapper = styled.div`
  ${header}
  ${main}  
  ${container}

  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;

    .form-field {
      &:nth-child(1) {
        grid-column: 1 / -1;
      }
    }
  }
`;

const VerificationCode = ({ nextPage }: any) => {
  const [form, setForm] = useState({ code: { value: "", message: "" } });

  const onChange = (e: any) => {
    const { value, name } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: { value, message: "" } }));
  };

  const onSubmit = () => {
    nextPage();
  };

  return (
    <Wrapper>
      <H3 className="heading">Recover your Password</H3>
      <Text className="subtitle">
        Please, enter your email which is connected to your account.
      </Text>
      <form className="container">
        <div className="form-field">
          <Password
            value={form.code.value}
            message={form.code.message}
            name="code"
            label="Verification Code"
            onChange={onChange}
          />
        </div>
        <Button type="button" className="text">
          Resend code
        </Button>
        <Button type="button" className="contained" onClick={onSubmit}>
          Continue
        </Button>
      </form>
    </Wrapper>
  );
};

export default VerificationCode;
