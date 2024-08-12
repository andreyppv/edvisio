import React from "react";
import styled from "styled-components";

const Wrapper = styled.label`
  color: #28293d;
  margin: 2px 0 8px;
  font-size: 14px;
  display: inline-block;
  font-weight: 700;
`;

export const requiredFieldLabel = (text: string) => {
  return (
    <>
      {text}
      <span style={{ color: "red" }}>*</span>
    </>
  );
};

const Component = ({ label = "", htmlFor = "" }: any) => {
  return (
    <Wrapper className="field-label" htmlFor={htmlFor}>
      {label}
    </Wrapper>
  );
};

export default Component;
