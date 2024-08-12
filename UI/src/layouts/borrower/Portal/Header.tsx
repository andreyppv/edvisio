import React from "react";
import styled from "styled-components";
import logo from "../../../assets/svgs/logos/logo-tuition-flex.svg";
import { ContainerLg as Container } from "../../Containers";

const Wrapper = styled.div`
  height: var(--header-height);
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }

  .logo-wrapper {
    height: 23px;

    & img {
      height: 100%;
    }
  }
`;

const MenuWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  .menu-logo {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-gray-2);
  }

  .name-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12px;
  }

  .school-name {
    text-transform: upperCase;
    font-weight: 700;
  }
`;

const UserMenu = () => {
  return (
    <MenuWrapper className="menu-wrapper">
      <div className="menu-logo">
        <img src="" alt="" />
      </div>
      <div className="name-wrapper">
        <div className="greeting">Hello,</div>
        <div className="school-name">css coding school</div>
      </div>
    </MenuWrapper>
  );
};

const Header = () => {
  return (
    <Wrapper>
      <Container className="container">
        <div className="logo-wrapper">
          <img src={logo} alt="" />
        </div>
        <UserMenu />
      </Container>
    </Wrapper>
  );
};

export default Header;
