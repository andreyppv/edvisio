import styled from "styled-components";

export default styled.ul`
  padding: 8px;
  border-radius: 4px;
  width: 100%;
  display: flex;
  gap: 12px;
  list-style: none;
  background: var(--color-bg-2);

  & button {
    border: none;

    width: 24px;
    height: 24px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    border-radius: 4px;
    font-size: 10px;
    color: var(--color-primary-dark-1);

    &:disabled {
      & svg path {
        fill: var(--color-gray-3);
      }
    }
    & svg path {
      fill: var(--color-gray-3);
    }
  }

  & > .disabled > button {
    color: #777;
    cursor: not-allowed;
  }

  & > li > button,
  .pagination > li > span {
    position: relative;
    line-height: 1.42857143;
    text-decoration: none;
    background-color: #fff;
    cursor: pointer;
    outline: none;
  }

  & > .active > button {
    z-index: 2;
    border: 1px solid var(--color-gray-3);
    cursor: pointer;
  }
  & > .disabled-active > button {
    z-index: 2;
    color: #fff;
    cursor: not-allowed;
    background-color: #337ab7;
    border-color: #337ab7;
  }
`;
