import { css } from "styled-components";

// table wrapper, table and the table content structure
export const table = css`
  position: relative;

  table {
    border-collapse: separate;
    border-spacing: 0;
    box-sizing: border-box;
    font-size: 14px;
    width: 100%;
    /* min-width: 1400px; */
    background: #fff;
  }

  .noTable {
    font-size: 20px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    position: relative;
  }
`;

export const classicTable = css`
  th,
  td {
    text-align: left;
  }
`;

export const gridTableRowChessBackground = css`
  & .tbody {
    & .tr {
      &:nth-child(odd) {
        background: var(--color-bg-2);
      }
      &:nth-child(even) {
        background: #fff;
      }
    }
  }
`;

export const tableRowChessBackground = css`
  & tbody {
    & tr {
      &:nth-child(odd) {
        background: var(--color-bg-2);
      }
      &:nth-child(even) {
        background: #fff;
      }
    }
  }
`;

export const roundedTable = css`
  padding: 0 10px 10px 0;
  table {
    & td,
    & th {
      border: 1px solid #ccc;
      border-style: none solid solid none;
    }

    & th {
      font-weight: 600;
    }

    & tr th:first-child {
      padding-left: 15px;
    }

    & tr:first-child td:first-child {
      border-top-left-radius: 10px;
    }
    & tr:first-child td:last-child {
      border-top-right-radius: 10px;
    }
    & tr:last-child td:first-child {
      border-bottom-left-radius: 10px;
    }
    & tr:last-child td:last-child {
      border-bottom-right-radius: 10px;
    }
    & tr:first-child td {
      border-top-style: solid;
    }
    & tr td:first-child {
      border-left-style: solid;
    }

    & tr:last-child td:first-child {
      border-bottom-left-radius: 10px;
    }

    & th {
      border: none;
      font-family: "Roboto", "Helvetica", "Arial", sans-serif;
      font-size: 13px;
      padding: 5px;
      text-transform: uppercase;
      text-align: left;
    }

    & tbody {
      border-radius: 10px;
      box-shadow: 4px 5px 9px rgba(0, 47, 94, 0.11);
    }
  }
`;

export const smallBordersTd = css`
  td,
  th {
    height: 1px;
  }
  padding: 12px 0;
  font-family: Montserrat;
  box-sizing: border-box;
  color: var(--color-gray-2);
  transition: all 0.3s;

  &.break {
    word-break: break-all;
  }

  & .cell {
    padding: 0 12px;
    height: 100%;
    display: flex;
    align-items: center;
  }

  & .border {
    border-left: 1px solid var(--color-gray-3);
  }
`;

export const gridTableStyles = css`
  .table {
    transition: all 0.3s;
    & .thead {
      background: #fff;
    }

    & .td {
      padding: 12px 24px;
    }
  }
`;

export const gridRoundedTable = css`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-gray-3);

  & .thead .tr,
  & .tbody .tr:not(:last-child) {
    border-bottom: 1px solid var(--color-gray-3);
  }
`;
