import React from "react";
import styled from "styled-components";
import { smallBordersTd } from "../../../../../../atoms/Table/Elements";

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
      <Th>
        <div className="cell">School Name</div>
      </Th>
      <Th>
        <div className="border cell">Last Name</div>
      </Th>
      <Th>
        <div className="border cell">First Name</div>
      </Th>
      <Th>
        <div className="border cell">App ID</div>
      </Th>
      <Th>
        <div className="border cell">SSN</div>
      </Th>
      <Th>
        <div className="border cell">Alternate ID Type</div>
      </Th>
      <Th>
        <div className="border cell">Alternate ID Number</div>
      </Th>
      <Th>
        <div className="border cell">Student ID</div>
      </Th>
      <Th>
        <div className="border cell">Program</div>
      </Th>
      <Th>
        <div className="border cell">App submit date</div>
      </Th>
      <Th>
        <div className="border cell">App request amount</div>
      </Th>
      <Th>
        <div className="border cell">Release to Servicing</div>
      </Th>
      <Th>
        <div className="border cell">Interest Rate In School Payment</div>
      </Th>
      <Th>
        <div className="border cell">After School Payment</div>
      </Th>
      <Th>
        <div className="border cell">Term</div>
      </Th>
      <Th>
        <div className="border cell">Academic Year</div>
      </Th>
    </tr>
  );
};

export default Thead;
