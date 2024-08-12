import React from "react";
import styled from "styled-components";
import {
  gridTableRowChessBackground,
  tableRowChessBackground,
  smallBordersTd,
  gridRoundedTable,
} from "../../atoms/Table/Elements";
import { GridTable, ClassicTable, RoundedTable } from "../../atoms/Table";
import { Rows, Thead } from "./Regular";
import { GRows, GThead } from "./Grid";

const ClassicTableWrapper = styled(ClassicTable)`
  td,
  th {
    padding: 12px 0;
  }
  ${tableRowChessBackground}
  ${smallBordersTd}
`;

const RoundedTableWrapper = styled(RoundedTable)`
  td,
  th {
    padding: 12px;
  }
`;

const GridTableWrapper = styled(GridTable)`
  .tr {
    display: grid;
    grid-template-columns: 50px 100px 1fr 130px;
  }
  ${gridRoundedTable}
  ${gridTableRowChessBackground}
`;

const Wrapper = styled.div`
  padding: 40px;
  table {
    width: 700px;
    & td {
      transition: all 0.3s;
      position: relative;
    }
  }
  section {
    display: flex;
    column-gap: 20px;
    margin-bottom: 20px;
  }
`;

const items = [
  {
    id: "1",
    date: "11/11/2022",
    details: "item description section",
    status: "active",
  },
  {
    id: "2",
    date: "11/11/2022",
    details: "item description section",
    status: "active",
  },
  {
    id: "3",
    date: "11/11/2022",
    details: "item description section",
    status: "active",
  },
];

const Tables = () => {
  return (
    <Wrapper>
      <section>
        <ClassicTableWrapper>
          <table>
            <Thead />
            <Rows items={items} />
          </table>
        </ClassicTableWrapper>
      </section>
      <section>
        <RoundedTableWrapper>
          <table>
            <Thead />
            <Rows items={items} />
          </table>
        </RoundedTableWrapper>
      </section>
      <section>
        <GridTableWrapper>
          <div className="table">
            <GThead />
            <GRows items={items} />
          </div>
        </GridTableWrapper>
      </section>
    </Wrapper>
  );
};

export default Tables;
