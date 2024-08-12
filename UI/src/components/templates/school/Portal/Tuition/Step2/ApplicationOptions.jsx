import React from "react";
import styled from "styled-components";
import { Subtitle as Heading } from "../../../../../atoms/Typography";

const Wrapper = styled.div`
  max-width: 930px;
  margin: 0 auto;
  ul {
    margin: 16px 0 32px;
    & li {
      font-size: 14px;
      color: var(--color-primary-dark-1);
    }
  }
`;

const ApplicationOptions = () => {
  return (
    <Wrapper>
      <Heading>Application options</Heading>
      <ul>
        <li>
          Save & Exit: Use this option if you would like to save this
          application to complete at the later time.
        </li>
        <li>
          Complete Application: Use this option to complete all required fields
          on behalf of the Applicant.
        </li>
        <li>
          Student Completes Application: Use this option if you would like the
          Student Application to enter all required fields on the application.
        </li>
      </ul>
    </Wrapper>
  );
};

export default ApplicationOptions;
