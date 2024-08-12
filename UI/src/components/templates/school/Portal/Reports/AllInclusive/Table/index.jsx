/*eslint-disable*/
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Table from "../../../../../../organisms/Tables/Default";
import Rows from "./Rows";
import Thead from "./Thead";
import { fetchTable } from "../../../../../../organisms/Tables/mockApi";
import { ClassicTable } from "../../../../../../atoms/Table";
import { rows } from "./mockRows";
import Header from "./Header";
import { filtersApplied } from "./config";
import { useUserData } from "../../../../../../../contexts/admin";

const TableWrapper = styled(ClassicTable)`
  border-radius: 12px;
  border: 1px solid var(--color-gray-3);
  overflow: hidden;
  .table-wrapper {
    & .table-container {
      border-top: 1px solid var(--color-gray-3);
      border-bottom: 1px solid var(--color-gray-3);
      overflow: auto;
    }
  }
`;

const TableControls = ({ query }) => {
  const { user } = useUserData();
  const name = user?.data?.firstName;
  const [filters, setFilters] = useState(filtersApplied({ ...query, name }));

  useEffect(() => {
    setFilters(filtersApplied({ ...query, name }));
  }, [query, name]);

  return (
    <TableWrapper>
      <Header filtersApplied={filters} />
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
