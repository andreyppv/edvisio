import React from "react";
import styled from "styled-components";
import logo from "../../../assets/svgs/logos/logo-tuition-flex.svg";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--header-height);

  .logo-wrapper {
    height: 23px;

    & img {
      height: 100%;
    }
  }
`;

const Header = () => {
  return (
    <Wrapper>
      <div className="logo-wrapper">
        <img src={logo} alt="" />
      </div>
    </Wrapper>
  );
};

export default Header;
