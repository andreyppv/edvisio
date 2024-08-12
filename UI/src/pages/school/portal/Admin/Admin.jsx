import React, { useState } from "react";
import styled from "styled-components";
import { H5 } from "../../../../components/atoms/Typography";
import Layout from "../../../../layouts/school/Portal";
import { routes } from "../../../../routes/School/routes";
import Form from "../../../../components/templates/school/Portal/Admin/Form";
import Table from "../../../../components/templates/school/Portal/Admin/Table";
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
  const [query, setQuery] = useState();

  const onSearchHandler = (searchQuery) => {
    setQuery(searchQuery);
  };

  return (
    <Layout currentRoute={routes.ADMIN}>
      <Wrapper>
        <H5>Search App</H5>
        <Card>
          <Form onChange={onSearchHandler} />
        </Card>
        <Card className="table-wrapper-card">
          <Table query={query} />
        </Card>
      </Wrapper>
    </Layout>
  );
};

export default Search;
