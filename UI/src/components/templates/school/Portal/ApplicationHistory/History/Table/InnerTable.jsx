import React from "react";
import styled from "styled-components";
import { GridTable } from "../../../../../../atoms/Table";
import { formatDate } from "../../../../../../../utils/formats";

const Wrapper = styled(GridTable)`
  width: 100%;
  border-radius: 4px;
  border: 1px solid var(--color-gray-3);
  overflow: hidden;

  .table {
    & .tbody,
    & .thead {
      & .tr {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        background: #fff !important;
      }
    }

    & .tbody {
      border-top: 1px solid var(--color-gray-3);
    }

    & .th,
    & .td {
      padding: 12px;
    }
  }
`;

const Thead = () => {
  return (
    <div className="thead">
      <div className="tr">
        <div className="td">
          <div className="cell">Date Created</div>
        </div>
        <div className="td">
          <div className="cell border">Type</div>
        </div>
        <div className="td">
          <div className="cell border">Details</div>
        </div>
        <div className="td">
          <div className="cell border">Created by</div>
        </div>
        <div className="td">
          <div className="cell border">Status</div>
        </div>
      </div>
    </div>
  );
};

const Rows = ({ items = [] }) => {
  return (
    <div className="tbody">
      {items.map(({ id, date, type, details, createdBy, status }) => {
        return (
          <div className="tr" key={id}>
            <div className="td">
              <div className="cell">{formatDate(date)}</div>
            </div>
            <div className="td">
              <div className="cell border">{type}</div>
            </div>
            <div className="td">
              <div className="cell border">{details}</div>
            </div>
            <div className="td">
              <div className="cell border">{createdBy}</div>
            </div>
            <div className="td">
              <div className="cell border">{status}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Table = ({ items }) => {
  return (
    <Wrapper>
      <div className="table">
        <Thead />
        <Rows items={items} />
      </div>
    </Wrapper>
  );
};

export default Table;
