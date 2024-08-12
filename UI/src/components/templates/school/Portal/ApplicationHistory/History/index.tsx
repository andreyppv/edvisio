import React from "react";
import styled from "styled-components";
import Table from "./Table";
import { Text as Heading } from "../../../../../atoms/Typography";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .heading {
    font-weight: 600;
    color: var(--color-gray-2);
  }
`;

const HistoryTable = ({ transactions }: any) => {
  return (
    <Layout className="content-wrapper">
      <Heading className="heading">Application Transactions</Heading>
      <Table items={transactions?.applicationTransactions} />
      <Heading className="heading">Borrower Transactions</Heading>
      <Table items={transactions?.borrowerTransactions} />
      <Heading className="heading">Сosigner Transactions</Heading>
      <Table items={transactions?.coSignerTransactions} />
    </Layout>
  );
};

export default HistoryTable;
