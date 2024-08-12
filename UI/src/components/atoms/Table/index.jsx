import styled from "styled-components";
import { table, classicTable, roundedTable, gridTableStyles } from "./Elements";

export const ClassicTable = styled.div`
  ${table}
  ${classicTable}
`;

export const RoundedTable = styled.div`
  ${table}
  ${roundedTable}
`;

export const TableFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .pagesCounter {
    padding: 10px;
  }
`;

export const Cell = styled.div`
  padding: 14px;
  .agent-view-button {
    text-transform: unset;
  }
`;

export const GridTable = styled.div`
  ${gridTableStyles}
`;
