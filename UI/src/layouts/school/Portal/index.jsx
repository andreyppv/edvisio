import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { ContainerLg as Container } from "../../Containers";
import Navigation from "./Navigation";

const Wrapper = styled.div`
  main {
    background: var(--color-bg-2);
    min-height: calc(100vh - var(--header-height));
  }
`;

const Layout = ({ children, currentRoute }) => {
  return (
    <Wrapper>
      <Header />
      <main>
        <Navigation currentRoute={currentRoute} />
        <Container className="container">{children}</Container>
      </main>
    </Wrapper>
  );
};

export default Layout;
