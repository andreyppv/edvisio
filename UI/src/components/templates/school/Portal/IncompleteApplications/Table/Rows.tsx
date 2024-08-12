import React, { useState } from "react";
import styled from "styled-components";
import { formatCurrency, formatDate } from "../../../../../../utils/formats";
import { smallBordersTd } from "../../../../../atoms/Table/Elements";
import { StyledLink } from "../../../../../atoms/Buttons/Regular";
import Menu from "../../../../../organisms/Menu/TableRow";
import { menuButtons } from "../../../../../organisms/Menu/TableRow/config";

const Td = styled.td`
  ${smallBordersTd}
  font-size: 10px;
  transition: all 0.3s;
`;

const Rows = ({ items }: any) => {
  const [open, setOpen] = useState("");

  const toggleMenu = (name: string) => {
    if (name !== open) {
      setOpen(name);
    } else {
      setOpen("");
    }
  };

  return items.map(
    ({
      school,
      appId,
      date,
      program,
      applicantName,
      studentName,
      ssn,
      altIdTyp,
      altIdNumber,
      status,
      amount,
      decision,
      fico,
      screenTracking,
    }: any) => {
      const active = open === screenTracking;
      return (
        <tr key={screenTracking}>
          <Menu
            active={active}
            onToggle={() => toggleMenu(screenTracking)}
            buttons={menuButtons}
          />
          <Td>
            <div className="cell">{formatDate(date)}</div>
          </Td>
          <Td>
            <div className="border cell">{school}</div>
          </Td>
          <Td>
            <div className="border cell">{program}</div>
          </Td>
          <Td>
            <div className="border cell">
              <StyledLink to="">{appId}</StyledLink>
            </div>
          </Td>
          <Td>
            <div className="border cell">{applicantName}</div>
          </Td>
          <Td>
            <div className="cell border">{studentName}</div>
          </Td>

          <Td>
            <div className="border cell">{ssn}</div>
          </Td>
          <Td>
            <div className="border cell">{altIdTyp}</div>
          </Td>

          <Td>
            <div className="border cell">{altIdNumber}</div>
          </Td>

          <Td>
            <div className="border cell">{status}</div>
          </Td>

          <Td>
            <div className="border cell">{formatCurrency(amount)}</div>
          </Td>

          <Td>
            <div className="border cell">{decision}</div>
          </Td>
          <Td>
            <div className="border cell">{fico}</div>
          </Td>
        </tr>
      );
    }
  );
};

export default Rows;
