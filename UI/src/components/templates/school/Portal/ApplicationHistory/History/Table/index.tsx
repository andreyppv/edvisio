import React from "react";
import styled from "styled-components";
import {
  smallBordersTd,
  tableRowChessBackground,
} from "../../../../../../atoms/Table/Elements";
import { GridTable } from "../../../../../../atoms/Table";
import Thead from "./Thead";
import Rows from "./Rows";

const TableWrapper = styled(GridTable)`
  border: 1px solid var(--color-gray-3);
  border-radius: 6px;
  overflow: hidden;
  .table {
    font-size: 12px;
    & .tr {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      & .td,
      & .th {
        ${smallBordersTd}
      }
    }
  }

  ${tableRowChessBackground}
`;

const HistoryTable = ({ items }: any) => {
  return (
    <TableWrapper>
      <div className="table">
        <Thead />
        <Rows items={items} />
      </div>
    </TableWrapper>
  );
};

export default HistoryTable;
