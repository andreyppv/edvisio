import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { ContainerLg as Container } from "../../Containers";
import Footer from "../Footer";
import Navigation from "./Navigation";

const Wrapper = styled.div`
  main {
    min-height: var(--main-height);
    background: var(--color-bg-2);
    padding: 48px 20px;
  }

  .container {
    display: flex;
    gap: 4px;
  }

  .content {
    padding: 60px;
  }

  .content-wrapper,
  .navigation-wrapper {
    background: #fff;
  }

  .content-wrapper {
    flex-grow: 1;
    box-shadow: 10px 12px 22px rgba(0, 0, 0, 0.12);
  }

  .navigation-wrapper {
    box-shadow: 0px 12px 22px rgba(0, 0, 0, 0.12);
  }
`;

const Layout = ({ children }: any) => {
  return (
    <Wrapper>
      <Header />
      <main>
        <Container className="container">
          <div className="navigation-wrapper">
            <Navigation />
          </div>
          <div className="content-wrapper">
            <div className="content">{children}</div>
          </div>
        </Container>
      </main>
      <Footer />
    </Wrapper>
  );
};

export default Layout;
