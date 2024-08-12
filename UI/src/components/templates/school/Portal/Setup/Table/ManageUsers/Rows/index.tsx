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
      lastName,
      firstName,
      email,
      lastLoginDate,
      status,
      group,
      screenTracking,
      middleName = "",
      role = "",
      userName = "",
      salutation = "",
      ed2go = false,
    }: any) => {
      return (
        <tr key={screenTracking}>
          <Td>
            <div className="cell">
              <Actions
                cb={cb}
                screenTracking={screenTracking}
                formData={{
                  lastName,
                  firstName,
                  email,
                  middleName,
                  status,
                  role,
                  salutation,
                  userName,
                  ed2go,
                }}
              />
            </div>
          </Td>
          <Td>
            <div className="cell">
              {firstName} {lastName}
            </div>
          </Td>
          <Td>
            <div className="border cell">{group}</div>
          </Td>
          <Td>
            <div className="cell border">{email}</div>
          </Td>
          <Td>
            <div className="border cell">{formatDate(lastLoginDate)}</div>
          </Td>
          <Td>
            <div className="border cell">{status}</div>
          </Td>
        </tr>
      );
    }
  );
};

export default Rows;
