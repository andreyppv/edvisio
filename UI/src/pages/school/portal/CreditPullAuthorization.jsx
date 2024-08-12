import React, { useState } from "react";
import styled from "styled-components";
import { H5 } from "../../../components/atoms/Typography";
import Layout from "../../../layouts/school/Portal";
import { routes } from "../../../routes/School/routes";
import Card from "../../../components/atoms/Cards";
import Form from "../../../components/templates/school/Portal/Tuition/CreditPullAuthorization";
import Approved from "../../../components/templates/school/Portal/Tuition/CreditPullAuthorization/Approved";

const Wrapper = styled.div`
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .table-wrapper-card {
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
`;

const CreditPullAuthorization = () => {
  const [isApproved, setIsApproved] = useState(false);

  const onStepChange = (status) => setIsApproved(status);

  return (
    <Layout currentRoute={routes.CREDIT_PULL_AUTHORIZATION}>
      <Wrapper>
        <H5>Credit Pull Authorization</H5>
        <Card className="table-wrapper-card">
          {isApproved ? <Approved /> : <Form onStepChange={onStepChange} />}
        </Card>
      </Wrapper>
    </Layout>
  );
};

export default CreditPullAuthorization;
