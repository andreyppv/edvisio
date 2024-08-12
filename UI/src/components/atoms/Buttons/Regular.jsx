import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

export const button = css`
  display: block;
  border: none;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
  padding: 12px 16px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  font-weight: 700;
  text-transform: upperCase;
  font-family: Montserrat;

  &.contained {
    background: var(--color-primary-dark-1);
    color: #fff;

    &:hover {
      background: var(--color-primary-dark-2);
    }

    &:active {
      background: var(--color-primary-green-1);
    }

    &:disabled {
      background: var(--color-gray-3);
    }

    & svg path {
      fill: #fff;
    }
  }

  &.outlined {
    background: transparent;
    color: var(--color-primary-green-1);
    border: 1px solid var(--color-primary-green-1);

    &:hover {
      border: 1px solid var(--color-primary-green-2);
      color: var(--color-primary-green-2);
    }

    &:active {
      background: var(--color-primary-green-5);
      border: 1px solid var(--color-primary-green-2);
      color: var(--color-primary-green-2);
    }

    & svg path {
      fill: var(--color-primary-green-1);
    }
  }

  &.text {
    font-weight: 600;
    background: transparent;
    color: var(--color-primary-green-1);
    border: none;

    &:hover {
      border: none;
      color: var(--color-primary-green-2);
    }

    &:active {
      background: var(--color-primary-green-5);
      border: none;
      color: var(--color-primary-green-2);
    }

    &:disabled {
      border: none;
      color: var(--color-gray-3);
    }
  }

  &.icon {
    display: flex;
    align-items: center;
    column-gap: 10px;
    justify-content: center;
    & svg path {
      fill: #fff;
    }
  }

  &:active {
    transform: scale(0.98);
    box-shadow: none;
  }
`;

export const buttonCircle = css`
  background: #fff;
  border: 1px solid var(--color-primary-green-1);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ButtonContent = styled.div`
  ${button}
`;

export const Button = styled.button`
  ${button}
`;

export const LinkButton = styled(Link)`
  ${button}
  text-decoration: none;
  text-align: center;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  font-weight: 700;
  &,
  &:visited {
    color: var(--color-functional-blue-1);
  }
`;
