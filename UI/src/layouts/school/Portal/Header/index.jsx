import React from "react";
import styled from "styled-components";
import { ContainerLg as Container } from "../../../Containers";
import { LinkButton } from "../../../../components/atoms/Buttons/Regular";
import logo from "../../../../assets/svgs/logos/logo-tuition-flex.svg";
import { routes } from "../../../../routes/School/routes";
import UserControl from "./UserControl";

const Wrapper = styled.div`
  height: var(--header-height);
  background: #fff;

  display: flex;
  align-items: center;

  .outlined {
    padding: 12px;
  }

  & .container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo-wrapper img {
      height: 24px;
    }

    & nav {
      display: flex;
      align-items: center;
      gap: 12px;
      & a {
        text-transform: upperCase;
      }
    }
  }
`;

const navigationButtons = [
  { to: routes.TUITION_FLEX, label: "start tuitionflex" },
  { to: routes.TUITION_EXTEND, label: "start tuitionextend" },
  { to: routes.TUITION_EASE, label: "start tuitionease" },
  { to: routes.CREDIT_PULL_AUTHORIZATION, label: "credit pull authorization" },
];

const Header = () => {
  return (
    <Wrapper>
      <Container className="container">
        <div className="logo-wrapper">
          <img src={logo} alt="" />
        </div>
        <nav className="navigation">
          {navigationButtons.map(({ to, label }) => {
            return (
              <LinkButton to={to} key={label} className="outlined">
                {label}
              </LinkButton>
            );
          })}
        </nav>
        <UserControl />
      </Container>
    </Wrapper>
  );
};

export default Header;
