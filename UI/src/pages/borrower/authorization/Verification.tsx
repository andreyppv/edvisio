import React from "react";
import styled from "styled-components";
import Layout from "../../../layouts/borrower/Authorization";
import { ContainerLg as Container } from "../../../layouts/Containers";
import SignInForm from "../../../components/templates/borrower/authorization/SignIn";
import Verification from "../../../components/templates/borrower/authorization/Multifactor";

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

  .singIn-wrapper {
    display: flex;
    flex-direction: column;

    & form {
      flex-grow: 1;
    }
    .buttons-wrapper {
      margin-top: auto;
    }
  }
`;

const Authorization = () => {
  return (
    <Layout>
      <Wrapper>
        <Container className="container">
          <Verification />
          <SignInForm />
        </Container>
      </Wrapper>
    </Layout>
  );
};

export default Authorization;
