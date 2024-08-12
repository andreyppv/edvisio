import React from "react";
import styled from "styled-components";
import { H3 as Heading } from "../../../../atoms/Typography";
import PDFRender from "../../../../molecules/PDFrender";
import placeholder from "./termsOfUse.pdf";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 70px;
  p {
    font-size: 14px;
  }
`;

const Consent = () => {
  return (
    <Wrapper>
      <Heading>
        Retail Installment Sale Agreement Application and Solicitation
        Disclosure
      </Heading>
      <PDFRender pdf={placeholder} />
    </Wrapper>
  );
};

export default Consent;
