import React from "react";
import styled from "styled-components";
import {
  routes,
  pageName as reportNames,
} from "../../../../../../routes/School/routes";
import { ReactComponent as Logo } from "../../../../../../assets/svgs/list.svg";
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
    title: "Applications Pending Certification",
    subtitle: "Submitted applications awaiting certification.",
    link: `${routes.REPORTS}/${reportNames.PENDING_CERTIFICATION}`,
    logo: <Logo />,
  },
  {
    title: "Incomplete Applications",
    subtitle: "Applications started, but not completed.",
    link: `${routes.REPORTS}/${reportNames.INCOMPLETE_APPLICATIONS}`,
    logo: <Logo />,
  },
  {
    title: "Applications Pending Esignature",
    subtitle: "Applications waiting for borrower/cosigner esignature.",
    link: `${routes.REPORTS}/${reportNames.PENDING_SIGNATURE}`,
    logo: <Logo />,
  },
  {
    title: "Processed School Certifications",
    subtitle: "All applications certified through the school portal.",
    link: `${routes.REPORTS}/${reportNames.PROCESSED_CERTIFICATIONS}`,
    logo: <Logo />,
  },
  {
    title: "School Pre-Approval Report",
    subtitle: `All applications in "School Pre-Approval Incomplete" status.`,
    link: `${routes.REPORTS}/${reportNames.PRE_APPROVAL}`,
    logo: <Logo />,
  },
  {
    title: "Application All-Inclusive Report",
    subtitle: "All applications, all statuses.",
    link: `${routes.REPORTS}/${reportNames.ALL_INCLUSIVE}`,
    logo: <Logo />,
  },
];

const ReportsList = () => {
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

export default ReportsList;
