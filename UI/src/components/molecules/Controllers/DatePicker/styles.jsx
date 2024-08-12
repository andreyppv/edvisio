import { css } from "styled-components";

export const datePickerSmall = css`
  .textField {
    & .MuiOutlinedInput-root.MuiInputBase-root fieldset {
      border: 1px solid var(--color-gray-3);
      border-radius: 6px;
    }

    .MuiTextField-root {
      background: #fff;
    }

    & .MuiButtonBase-root.MuiIconButton-root {
      padding: 0 4px;
      margin: 0;
    }

    .MuiInputBase-root.MuiOutlinedInput-root {
      padding: 0;
      height: 32px;
    }

    .MuiInputAdornment-root {
      margin: 0;
    }

    & .MuiInputBase-input {
      width: 80px;
      height: auto;
      padding: 10px 0 10px 8px;
      font-size: 12px;
      font-weight: 700;
      color: var(--color-primary-dark-1);
    }
  }
`;
