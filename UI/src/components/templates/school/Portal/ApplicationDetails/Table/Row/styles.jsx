import styled, { css } from "styled-components";
import { smallBordersTd } from "../../../../../../atoms/Table/Elements";

export const editField = css`
  & .edit-mode-input-wrapper {
    width: 100%;
    & .input-wrapper {
      max-width: 120px;
      width: 100%;
      display: flex;
      align-items: center;
    }
    & input,
    & select {
      font-size: 12px;
      min-width: auto;
      padding: 10px 8px;
      background: transparent;
      border-bottom: none;
      color: var(--color-functional-blue-1);
      font-weight: 600;
      padding: 0;
    }

    .MuiOutlinedInput-notchedOutline {
      display: none;
    }

    & .textField {
      border: none;
      svg path {
        fill: var(--color-functional-blue-1);
      }
    }
  }
`;

const Row = styled.tr`
  & td {
    ${smallBordersTd}
    font-size: 12px;

    &:first-child {
      width: 50%;
      & div {
        font-weight: 700;
      }
    }

    & ul {
      list-style: none;
      & li {
        padding: 3px 0;
        line-height: 1.5;
      }
    }

    & .form-labels {
      margin-left: 64px;
      margin-top: 6px;

      & li {
        font-weight: 700;
      }
    }

    & .field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 18px;
    }

    & .form-values {
      padding-top: 28px;
      width: 100%;
    }

    .buttons-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }
`;

export default Row;
