/*eslint-disable*/
import React from "react";
import styled from "styled-components";
import Table from "../../../../../organisms/Tables/Default";
import Rows from "./Rows";
import Thead from "./Thead";
import { fetchTable } from "../../../../../organisms/Tables/mockApi";
import { ClassicTable } from "../../../../../atoms/Table";
import { rows } from "./mockRows";

const TableWrapper = styled(ClassicTable)`
  .table-wrapper {
    border-radius: 12px;
    border: 1px solid var(--color-gray-3);
    overflow: hidden;

    & .table-container {
      overflow: auto;
    }
  }
`;

const TableControls = ({ query }) => {
  return (
    <TableWrapper>
      <Table
        api={fetchTable}
        payload={{ mockRows: rows }}
        rows={Rows}
        thead={Thead}
        query={query}
      />
    </TableWrapper>
  );
};

export default TableControls;
