import React from "react";
import styled from "styled-components";
import { H5 } from "../../../components/atoms/Typography";
import Layout from "../../../layouts/school/Portal";
import { routes } from "../../../routes/School/routes";
import Table from "../../../components/templates/school/Portal/Certify/Table";
import Card from "../../../components/atoms/Cards";

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
    <Layout currentRoute={routes.CERTIFY}>
      <Wrapper>
        <H5>Certify Applications</H5>
        <Card className="table-wrapper-card">
          <Table />
        </Card>
      </Wrapper>
    </Layout>
  );
};

export default Certify;
