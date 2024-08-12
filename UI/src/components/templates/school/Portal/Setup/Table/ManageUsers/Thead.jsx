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
      <Th />
      <Th>
        <div className="cell">Name</div>
      </Th>
      <Th>
        <div className="border cell">Group</div>
      </Th>
      <Th>
        <div className="border cell">Email</div>
      </Th>
      <Th>
        <div className="border cell">Last Login Date</div>
      </Th>
      <Th>
        <div className="border cell">Status</div>
      </Th>
    </tr>
  );
};

export default Thead;
