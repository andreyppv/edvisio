import React from "react";
import styled from "styled-components";
import { routes } from "../../../../../../routes/School/routes";
import { ReactComponent as PersonIcon } from "../../../../../../assets/svgs/person-copy.svg";
import { ReactComponent as ClockIcon } from "../../../../../../assets/svgs/clock.svg";
import ListButton from "../../../../../molecules/Buttons/ListBtn";

const Wrapper = styled.div`
  ul {
    & li {
      list-style: none;
      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }
`;

const renderReportsList = [
  {
    title: "Manage Users",
    link: `${routes.MANAGE_USERS}`,
    logo: <PersonIcon />,
  },
  {
    title: "Manage academic periods",
    link: `${routes.MANAGE_ACADEMIC_PERIODS}`,
    logo: <ClockIcon />,
  },
];

const List = () => {
  return (
    <Wrapper>
      <ul>
        {renderReportsList.map((item) => {
          return (
            <li key={item.link}>
              <ListButton {...item} />
            </li>
          );
        })}
      </ul>
    </Wrapper>
  );
};

export default List;
