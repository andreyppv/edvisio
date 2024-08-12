import React from "react";
import styled from "styled-components";
import { smallBordersTd } from "../../../../../atoms/Table/Elements";
import { ClassicTable, Cell } from "../../../../../atoms/Table";

const TableWrapper = styled(ClassicTable)`
  border: 1px solid var(--color-gray-3);
  border-radius: 6px;
  overflow: hidden;
  table {
    & tr:not(:last-child) td {
      border-bottom: 1px solid var(--color-gray-3);
    }
    & tr {
      &:nth-child(odd) {
        background: #fff;
      }

      &:nth-child(even) {
        background: var(--color-bg-2);
      }

      td {
        ${smallBordersTd}
        font-size: 12px;

        &:first-child {
          width: 340px;
          & .cell {
            font-weight: 700;
          }
        }
      }
    }
  }
`;

const InfoTable = ({ items = [] }: any) => {
  return (
    <TableWrapper className="content-wrapper">
      <table>
        <tbody>
          {items.map(({ label, value, id }: any) => {
            return (
              <tr key={id}>
                <td>
                  <Cell className="cell">{label}</Cell>
                </td>
                <td>
                  <Cell className="cell border">{value}</Cell>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableWrapper>
  );
};

export default InfoTable;
