import React from "react";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import { formatCurrency, formatDate } from "../../../../../../../utils/formats";
import { smallBordersTd } from "../../../../../../atoms/Table/Elements";
import { StyledLink } from "../../../../../../atoms/Buttons/Regular";

const Td = styled.td`
  ${smallBordersTd}
  font-size: 10px;
`;

const Rows = ({ items }: any) => {
  return items.map(
    ({
      school,
      ssn,
      altIdType,
      altIdNumber,
      requestedAmount,
      firstName,
      lastName,
      appId,
      studentId,
      program,
      submitDate,
      releaseToServicing,
      interestRate,
      afterSchoolPayment,
      term,
      academicYear,
    }: any) => {
      return (
        <tr key={uuid()}>
          <Td>
            <div className="cell">{school}</div>
          </Td>
          <Td>
            <div className="cell border">{lastName}</div>
          </Td>

          <Td>
            <div className="border cell">{firstName}</div>
          </Td>

          <Td>
            <div className="border cell">
              <StyledLink to="">{appId}</StyledLink>
            </div>
          </Td>

          <Td>
            <div className="border cell">{ssn}</div>
          </Td>

          <Td>
            <div className="border cell">{altIdType}</div>
          </Td>

          <Td>
            <div className="border cell">{altIdNumber}</div>
          </Td>

          <Td>
            <div className="border cell">{studentId}</div>
          </Td>

          <Td>
            <div className="border cell">{program}</div>
          </Td>

          <Td>
            <div className="border cell">{formatDate(submitDate)}</div>
          </Td>

          <Td>
            <div className="border cell">{formatCurrency(requestedAmount)}</div>
          </Td>

          <Td>
            <div className="border cell">{formatDate(releaseToServicing)}</div>
          </Td>

          <Td>
            <div className="border cell">
              {interestRate ? `${interestRate}%` : "N/A"}
            </div>
          </Td>

          <Td>
            <div className="border cell">
              {formatCurrency(afterSchoolPayment)}
            </div>
          </Td>

          <Td>
            <div className="border cell">{term ? `${term} months` : "N/A"}</div>
          </Td>

          <Td>
            <div className="border cell">{academicYear}</div>
          </Td>
        </tr>
      );
    }
  );
};

export default Rows;
