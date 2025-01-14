import styled, { css } from "styled-components";
import { input } from "./input";
import { select } from "./select";
import { password } from "./password";
import { datePicker, datePickerMui } from "./datepicker";
import { isFilled } from "./activities";

export const InputWrapper = styled.div`
  ${input}
  ${isFilled}
`;

export const SelectWrapper = styled.div`
  ${select}
  ${isFilled}
`;

export const PasswordWrapper = styled.div`
  ${password}
  ${isFilled}
`;

export const DatePickerWrapper = styled.div`
  ${datePicker}
  ${isFilled}
`;

const dynamicLabelInput = css`
  .input-wrapper {
    position: relative;
    & .field-label {
      position: absolute;
      top: 50%;
      transform: translate(20px, -50%);
      left: 0;
      font-size: 14px;
      line-height: 1.5;
      font-weight: 400;
      margin: 0;
      transition: all 0.2s;
      z-index: 3;
      color: var(--color-gray-2);
      background: transparent;
      pointer-events: none;
    }
  }

  /* HIDE PLACEHOLDER IF FIELD IS EMPTY AND NOT FOCUSED */
  & input::placeholder {
    color: transparent;
  }

  /* PLACEHOLDER COLOR */
  & input:focus {
    &::placeholder {
      color: #b7b7b7;
    }
  }

  /* REMOVE DEFAULT AUTOFILL BACKGROUND */
  /* disable chrome autofill */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus,
  select:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px var(--color-bg-2) inset !important;
  }

  /* ON FIELD FOCUS */
  & select:focus + .field-label,
  & input:focus + .field-label,
  & select:focus + .field-label,
  &.isFilled .field-label {
    top: 0;
    background: transparent;
    padding: 2px 4px;
    z-index: 3;
    font-size: 12px;
    transform: translate(12px, -50%);
  }

  /* STYLES ON POPULATED FILED */

  &.isFilled select:focus,
  &.isFilled input:focus {
    border-color: var(--color-primary-green-1);
  }

  &.isFilled .field-label {
    color: var(--color-primary-green-1);
  }

  &.isFilled select,
  &.isFilled input {
    border-color: var(--color-primary-green-1);
    &:hover {
      background: transparent;
    }
  }

  & .dob-input:focus {
    &::placeholder {
      color: #ccc;
    }
  }
`;

export const DynamicLabelInput = styled.div`
  ${input}
  ${dynamicLabelInput}
`;

export const DynamicLabelPassword = styled.div`
  ${input}
  ${password}
  ${dynamicLabelInput}
`;

export const DynamicLabelSelect = styled.div`
  ${select}
  ${dynamicLabelInput}
`;

export const DynamicLabelDatePicker = styled.div`
  ${datePickerMui}
`;
