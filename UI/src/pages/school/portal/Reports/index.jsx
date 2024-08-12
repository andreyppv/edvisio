import React from "react";
import styled from "styled-components";
import { H5 } from "../../../../components/atoms/Typography";
import Layout from "../../../../layouts/school/Portal";
import { routes } from "../../../../routes/School/routes";
import List from "../../../../components/templates/school/Portal/Reports/List";

const Wrapper = styled.div`
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .table-wrapper-card {
    padding: 12px;
  }
`;

const Certify = () => {
  return (
    <Layout currentRoute={routes.REPORTS}>
      <Wrapper>
        <H5>Reports</H5>
        <List />
      </Wrapper>
    </Layout>
  );
};

export default Certify;
