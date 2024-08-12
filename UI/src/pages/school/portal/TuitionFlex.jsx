import React from "react";
import styled from "styled-components";
import { H5 } from "../../../components/atoms/Typography";
import Layout from "../../../layouts/school/Portal";
import { routes } from "../../../routes/School/routes";
import Card from "../../../components/atoms/Cards";
import Step1 from "../../../components/templates/school/Portal/Tuition/Step1/Extend";

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

const TuitionFlex = () => {
  return (
    <Layout currentRoute={routes.TUITION_FLEX}>
      <Wrapper>
        <H5>Start TuitionFlex</H5>
        <Card className="table-wrapper-card">
          <Step1 />
        </Card>
      </Wrapper>
    </Layout>
  );
};

export default TuitionFlex;
