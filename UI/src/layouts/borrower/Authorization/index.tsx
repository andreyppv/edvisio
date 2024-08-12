import React from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "../Footer";

const Wrapper = styled.div`
  main {
    min-height: var(--main-height);
    display: flex;
    align-items: stretch;
    justify-content: center;
  }
`;

const Layout = ({ children }: any) => {
  return (
    <Wrapper>
      <Header />
      <main>{children}</main>
      <Footer />
    </Wrapper>
  );
};

export default Layout;
