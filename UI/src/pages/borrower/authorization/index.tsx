import React from "react";
import styled from "styled-components";
import Layout from "../../../layouts/borrower/Authorization";
import { ContainerLg as Container } from "../../../layouts/Containers";
import SignUpForm from "../../../components/templates/borrower/authorization/Signup";
import SignInForm from "../../../components/templates/borrower/authorization/SignIn";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  background: linear-gradient(
    to right,
    var(--color-bg-2) 0%,
    var(--color-bg-2) 60%,
    #fff 60%,
    #fff 100%
  );

  .container {
    display: flex;
    justify-content: space-between;
  }
`;

const Authorization = () => {
  return (
    <Layout>
      <Wrapper>
        <Container className="container">
          <SignUpForm />
          <SignInForm />
        </Container>
      </Wrapper>
    </Layout>
  );
};

export default Authorization;
