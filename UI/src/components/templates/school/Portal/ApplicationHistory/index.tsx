import React from "react";
import styled from "styled-components";
import Table from "./Tables";
import Documents from "./Documents";
import History from "./History";
import {
  parseCosignerInfo,
  parseBorrowerInfo,
  parseAppProfile,
  parseAddress,
  parseReferenceHistory,
} from "./parsers";
import ExpandPanels from "../../../../organisms/Expand/Group";

const Wrapper = styled.div`
  .expand-list-wrapper {
    display: flex;
    padding: 12px;
    background: #fff;
    flex-direction: column;
    gap: 12px;
  }
  .content-wrapper {
    margin-top: 18px;
  }
`;

const items = ({ userData, transactionsData }: any) => [
  {
    id: 1,
    heading: "Borrower Information",
    content: <Table items={parseBorrowerInfo(userData)} />,
  },
  {
    id: 2,
    heading: "Cosigner Information",
    content: <Table items={parseCosignerInfo(userData)} />,
  },
  {
    id: 3,
    heading: "Application Documents",
    content: <Documents />,
  },
  {
    id: 4,
    heading: "App Profile",
    content: <Table items={parseAppProfile(userData)} />,
  },
  {
    id: 5,
    heading: "Address History",
    content: <Table items={parseAddress(userData)} />,
  },
  {
    id: 6,
    heading: "Reference History",
    content: <Table items={parseReferenceHistory(userData)} />,
  },
  {
    id: 7,
    heading: "History",
    content: <History transactions={transactionsData} />,
  },
];

const ApplicationHistory = ({ userData, transactionsData }: any) => {
  return (
    <Wrapper>
      <ExpandPanels items={items({ userData, transactionsData })} />
    </Wrapper>
  );
};

export default ApplicationHistory;
