import React from "react";
import styled from "styled-components";
import { H3 as Heading, Text } from "../../../../atoms/Typography";
import Form from "./Form";

const Wrapper = styled.div`
  padding: 50px 60px 50px 0;
  background: var(--color-bg-2);

  .heading,
  .subheading {
    color: var(--color-primary-green-1);
  }

  .subheading {
    margin: 12px 0 64px;
  }
`;

const SignUp = () => {
  return (
    <Wrapper>
      <Heading className="heading">Create Account</Heading>
      <Text className="subheading">
        If registering to complete an application that has been started by your
        school, enter all information to match exactly what your school entered
        previously.
      </Text>
      <Form />
    </Wrapper>
  );
};

export default SignUp;
