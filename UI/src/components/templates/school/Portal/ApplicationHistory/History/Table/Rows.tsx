import React, { useState } from "react";
import styled from "styled-components";
import { formatDate } from "../../../../../../../utils/formats";
import { Button } from "../../../../../../atoms/Buttons/Regular";
import { ReactComponent as Chevron } from "../../../../../../../assets/svgs/chevron-down.svg";
import Table from "./InnerTable";

const Tbody = styled.div`
  & > .tr {
    border-top: 1px solid var(--color-gray-3);
  }
  .createdBy {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  & .tr.active {
    background: var(--color-gray-4) !important;
    & .outlined {
      & svg {
        transform: rotate(180deg);
      }
    }
  }
  & .tr .td .cell {
    color: var(--color-primary-dark-1);
  }
  .outlined {
    padding: 8px;
    max-width: 130px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    line-height: 1.2;
    background: #fff;
  }

  & .table-menu {
    grid-column: 1 / -1;
  }
`;

const Rows = ({ items = [] }: any) => {
  const [open, setOpen] = useState("");

  return (
    <Tbody className="tbody">
      {items.map(({ date, type, createdBy, id, details }: any) => {
        const active = open === id;
        return (
          <div className={`tr ${active ? "active" : ""}`} key={id}>
            <div className="td">
              <div className="cell">{formatDate(date)}</div>
            </div>
            <div className="td">
              <div className="cell border">{type}</div>
            </div>
            <div className="td">
              <div className="cell border createdBy">
                {createdBy}
                <Button className="outlined" onClick={() => setOpen(id)}>
                  <Chevron />
                  View
                </Button>
              </div>
            </div>
            {active && (
              <div className="td table-menu">
                <div className="cell">
                  <Table items={details} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </Tbody>
  );
};

export default Rows;
