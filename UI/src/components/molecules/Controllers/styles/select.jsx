import { css } from "styled-components";
import { input } from "./input";
import logo from "../Select/chevron-down.svg";

export const select = css`
  ${input}

  select {
    appearance: none;
    padding-right: 30px;
    min-width: 120px;
  }
  .input-wrapper {
    background: #fff;
    border: transparent;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      height: 6px;
      width: 11px;
      right: 0;
      top: 50%;
      transform: translate(-100%, -50%);
      background: url("${logo}") no-repeat;
      pointer-events: none;
      z-index: 10;
    }
  }
`;
