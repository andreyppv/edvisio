import React from "react";
import styled from "styled-components";

const Thead = styled.div`
  .th .cell {
    font-weight: 700;
  }
`;

const TheadComponent = () => {
  return (
    <Thead className="thead">
      <div className="tr">
        <div className="th">
          <div className="cell">Create Date</div>
        </div>
        <div className="th">
          <div className="cell border">Type</div>
        </div>
        <div className="th">
          <div className="cell border">Created By</div>
        </div>
      </div>
    </Thead>
  );
};

export default TheadComponent;
