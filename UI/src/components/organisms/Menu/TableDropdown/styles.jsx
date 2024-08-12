import styled from "styled-components";

const MenuWrapper = styled.ul`
  padding: 20px;
  background: #fff;
  z-index: 100;
  list-style: none;
  box-shadow: var(--shadow-2);
  width: 230px;
  border-radius: 4px;

  & li {
    display: flex;
    align-items: center;
    gap: 12px;

    & button {
      font-weight: 700;
      text-transform: upperCase;
      font-size: 10px;
      border: none;
      color: var(--color-primary-dark-1);
      background: transparent;
    }

    &:not(:first-child) {
      margin-top: 30px;
    }

    .icon-wrapper {
      height: 15px;
      width: 15px;
      display: flex;
      justify-content: center;
    }

    & svg {
      height: 100%;
      & path {
        fill: var(--color-primary-dark-1);
      }
    }
  }
`;

export default MenuWrapper;
