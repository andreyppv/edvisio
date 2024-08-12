import React from "react";
import styled from "styled-components";
import { H3 as Heading, Text } from "../../../components/atoms/Typography";
import Form from "../../../components/templates/borrower/portal/SelectSchool";

const Wrapper = styled.div`
  .heading {
    margin-bottom: 24px;
  }

  .subheading {
    color: var(--color-gray-2);
    font-weight: 700;
  }
`;

const SelectSchool = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) {
    return <></>;
  }
  return (
    <Wrapper>
      <Heading className="heading">Select School and Program Terms</Heading>
      <Text className="subheading">
        Please select school, academic program and program terms for your
        TuitionFlex application.
      </Text>
      <Form />
    </Wrapper>
  );
};

export default SelectSchool;
