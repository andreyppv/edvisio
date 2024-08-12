import { css } from "styled-components";
import { isValid, isError } from "./activities";

export const input = css`
  background: transparent;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: Montserrat;

  input,
  select,
  textarea {
    width: 100%;
    padding: 20px 16px;
    font-size: 14px;
    outline: none;
    background-color: var(--color-bg-2);
    border: none;
    border-bottom: 1px solid var(--color-gray-2);
    color: var(--color-primary-dark-1);
    box-sizing: border-box;
    position: relative;
    font-weight: 400;
    z-index: 2;
    transition: all 0.2s;
    &::placeholder {
      color: #b7b7b7;
    }

    &:hover {
      background: #f9f9f9;
      border-color: #ebebeb;
    }
    &:focus {
      border-color: var(--color-primary-green-1);

      & + .field-label {
        color: var(--color-primary-green-1);
      }
    }
  }

  ${isValid}
  ${isError}
`;
