import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ContainerMd as Container } from "../../../Containers";
import { navItems } from "./config";

const NavigationWrapper = styled.div`
  height: 48px;
  background: #fff;
  border-top: 1px solid var(--color-gray-3);
  border-bottom: 1px solid var(--color-gray-3);
  box-sizing: border-box;
  .linkButton {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 13px;
    color: var(--color-gray-2);
    font-size: 10px;
    font-weight: 700;
    text-transform: upperCase;
    text-decoration: none;
  }

  .active {
    color: var(--color-primary-green-1);
    & svg path {
      fill: var(--color-primary-green-1);
    }
  }

  .navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 13px;
    height: 100%;
  }
`;

const Navigation = ({ currentRoute }) => {
  return (
    <NavigationWrapper>
      <Container className="navigation">
        {navItems.map(({ icon: Icon, to, label }) => {
          const isActive = to === currentRoute;
          return (
            <Link
              to={to}
              key={label}
              className={`text linkButton ${isActive ? "active" : ""}`}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </Container>
    </NavigationWrapper>
  );
};

export default Navigation;
