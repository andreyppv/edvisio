import React from "react";
import styled from "styled-components";
import { smallBordersTd } from "../../../../../../atoms/Table/Elements";

const Th = styled.th`
  ${smallBordersTd}
  font-size: 10px;
  .cell {
    font-weight: 700;
    transition: all 0.3s;
  }
`;

const Thead = () => {
  return (
    <tr>
      <Th />
      <Th>
        <div className="cell">Name</div>
      </Th>
      <Th>
        <div className="border cell">Description</div>
      </Th>
      <Th>
        <div className="border cell">Period Start Date</div>
      </Th>
      <Th>
        <div className="border cell">Period End Date</div>
      </Th>
    </tr>
  );
};

export default Thead;
