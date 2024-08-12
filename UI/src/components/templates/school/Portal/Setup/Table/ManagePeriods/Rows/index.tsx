import React from "react";
import styled from "styled-components";
import { formatDate } from "../../../../../../../../utils/formats";
import { smallBordersTd } from "../../../../../../../atoms/Table/Elements";
import Actions from "./Actions";

const Td = styled.td`
  ${smallBordersTd}
  font-size: 10px;
  transition: all 0.3s;
`;

const Rows = ({ items, cb }: any) => {
  return items.map(
    ({
      name = "",
      description = "",
      startDate = "",
      endDate = "",
      screenTracking,
    }: any) => {
      return (
        <tr key={screenTracking}>
          <Td>
            <div className="cell">
              <Actions
                cb={cb}
                screenTracking={screenTracking}
                formData={{
                  name,
                  description,
                  startDate,
                  endDate,
                }}
              />
            </div>
          </Td>
          <Td>
            <div className="cell">{name}</div>
          </Td>
          <Td>
            <div className="border cell">{description}</div>
          </Td>
          <Td>
            <div className="border cell">{formatDate(startDate)}</div>
          </Td>
          <Td>
            <div className="border cell">{formatDate(endDate)}</div>
          </Td>
        </tr>
      );
    }
  );
};

export default Rows;
