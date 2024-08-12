import React from "react";
import styled from "styled-components";
import { smallBordersTd } from "../../../../../atoms/Table/Elements";

const Th = styled.th`
  ${smallBordersTd}
  font-size: 10px;
  .cell {
    font-weight: 700;
  }
`;

const Thead = () => {
  return (
    <tr>
      <Th />
      <Th>
        <div className="cell">Date</div>
      </Th>
      <Th>
        <div className="border cell">School</div>
      </Th>
      <Th>
        <div className="border cell">Product</div>
      </Th>
      <Th>
        <div className="border cell">App ID</div>
      </Th>
      <Th>
        <div className="border cell">Borrower Name</div>
      </Th>
      <Th>
        <div className="border cell">Student Name</div>
      </Th>
      <Th>
        <div className="border cell">SSN </div>
      </Th>
      <Th>
        <div className="border cell">Alt ID Type</div>
      </Th>
      <Th>
        <div className="border cell">Alt ID Number</div>
      </Th>
      <Th>
        <div className="border cell">Status</div>
      </Th>
      <Th>
        <div className="border cell">Amount</div>
      </Th>
      <Th>
        <div className="border cell">Decision</div>
      </Th>
      <Th>
        <div className="border cell">FICO</div>
      </Th>
    </tr>
  );
};

export default Thead;
