import styled from "styled-components";
import { smallBordersTd } from "../../../atoms/Table/Elements";

const Td = styled.td`
  ${smallBordersTd}
  font-size: 10px;
  transition: all 0.3s;
  &.expanded {
    &,
    & ~ td {
      padding-bottom: 40px;
      background: var(--color-gray-4);
    }
  }

  & .cell {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-right: 0;
  }

  & .menu {
    left: 30px;
    margin-top: 10px;
  }

  .menu {
    display: flex;
    gap: 24px;
    position: absolute;
    button {
      display: flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      z-index: 100;
      & .label {
        text-transform: upperCase;
        color: var(--color-primary-dark-1);
        font-size: 10px;
        font-weight: 700;
      }

      svg path {
        fill: var(--color-primary-dark-1);
      }
    }
  }
`;

export default Td;
