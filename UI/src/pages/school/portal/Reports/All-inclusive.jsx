import React, { useState } from "react";
import styled from "styled-components";
import { H5 } from "../../../../components/atoms/Typography";
import Layout from "../../../../layouts/school/Portal";
import { routes } from "../../../../routes/School/routes";
import Form from "../../../../components/templates/school/Portal/Reports/AllInclusive/Form";
import Table from "../../../../components/templates/school/Portal/Reports/AllInclusive/Table";
import Card from "../../../../components/atoms/Cards";

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
  const [query, setQuery] = useState({});

  return (
    <Layout currentRoute={routes.REPORTS}>
      <Wrapper>
        <H5>Reports</H5>
        <Card>
          <Form onChange={setQuery} />
        </Card>
        <Card className="table-wrapper-card">
          <Table query={query} />
        </Card>
      </Wrapper>
    </Layout>
  );
};

export default Search;
