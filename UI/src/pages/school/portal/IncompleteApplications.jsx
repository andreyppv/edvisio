import React from "react";
import styled from "styled-components";
import { H5 } from "../../../components/atoms/Typography";
import Layout from "../../../layouts/school/Portal";
import { routes } from "../../../routes/School/routes";
import Card from "../../../components/atoms/Cards";
import Table from "../../../components/templates/school/Portal/IncompleteApplications/Table";

const Wrapper = styled.div`
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .table-wrapper-card {
    padding: 12px;
  }
`;

const Search = () => {
  return (
    <Layout currentRoute={routes.INCOMPLETE}>
      <Wrapper>
        <H5>Incomplete Applications</H5>
        <Card className="table-wrapper-card">
          <Table />
        </Card>
      </Wrapper>
    </Layout>
  );
};

export default Search;
