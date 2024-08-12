import React from "react";
import styled from "styled-components";
import {
  formatCurrency,
  formatDate,
  formatPhoneNumber,
  formatSSN,
} from "../../../../../../../utils/formats";
import { smallBordersTd } from "../../../../../../atoms/Table/Elements";
import Actions from "./Actions";

const Td = styled.td`
  ${smallBordersTd}
  font-size: 10px;
`;

const Rows = ({ items }: any) => {
  return items.map(
    ({
      school,
      program,
      startDate,
      endDate,
      date,
      product,
      appId,
      borrowerName,
      studentName,
      ssn,
      altIdType,
      altIdNumber,
      status,
      requestedAmount,
      amountApproved,
      phoneNumber,
      sentToServicerDate,
      screenTrackingId,
    }: any) => {
      return (
        <tr key={screenTrackingId}>
          <Td>
            <div className="cell">
              <Actions screenTrackingId={screenTrackingId} />
            </div>
          </Td>
          <Td>
            <div className="cell">{formatDate(date)}</div>
          </Td>

          <Td>
            <div className="border cell">{sentToServicerDate}</div>
          </Td>

          <Td>
            <div className="border cell">{school}</div>
          </Td>

          <Td>
            <div className="border cell">{program}</div>
          </Td>

          <Td>
            <div className="border cell">{formatDate(startDate)}</div>
          </Td>

          <Td>
            <div className="border cell">{formatDate(endDate)}</div>
          </Td>

          <Td>
            <div className="border cell">{product}</div>
          </Td>

          <Td>
            <div className="border cell">{appId}</div>
          </Td>

          <Td>
            <div className="border cell">{borrowerName}</div>
          </Td>

          <Td>
            <div className="border cell">{studentName}</div>
          </Td>

          <Td>
            <div className="border cell">{formatSSN(ssn)}</div>
          </Td>

          <Td>
            <div className="border cell">{altIdType}</div>
          </Td>

          <Td>
            <div className="border cell">{altIdNumber}</div>
          </Td>

          <Td>
            <div className="border cell">{status}</div>
          </Td>

          <Td>
            <div className="border cell">{formatCurrency(requestedAmount)}</div>
          </Td>

          <Td>
            <div className="border cell">{formatCurrency(amountApproved)}</div>
          </Td>

          <Td>
            <div className="border cell">{formatPhoneNumber(phoneNumber)}</div>
          </Td>
        </tr>
      );
    }
  );
};

export default Rows;
