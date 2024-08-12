import React from "react";
import styled from "styled-components";
import { H3 as Heading } from "../../../../atoms/Typography";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 70px;
  p {
    font-size: 14px;
  }
`;

const CreditCheck = () => {
  return (
    <Wrapper>
      <Heading>Credit Check Authorization</Heading>
      <p>
        By checking the &quot;Continue&quot; button below, I authorize
        TuitionFlex, a National Lending Associates, Inc. company, on behalf of
        the School or its designated agents, and any assignee or guarantor of
        this contract, to investigate my credit worthiness, to access, review
        and/or share with the School or its designated agents, or any assignee
        or guarantor of this retail installment contract, my credit report, and
        to furnish information about this application and my contract to
        consumer reporting agencies and other persons who may legally receive
        such information. A consumer report may be requested in connection with
        this application for credit for the purpose of evaluating my credit and
        verifying my identity, or for updating, renewing, servicing, modifying
        or collecting any credit that I may obtain. Upon request, you will
        inform me whether or not a consumer report was requested. If a report
        was requested, you will inform me of the name and address of the
        consumer reporting agency that furnished the report. Any preliminary
        decision that the School makes about my eligibility for a retail
        installment contract does not mean the application process is final or
        guarantee the contract, or guarantee my approval for a contract later.
        My authorization to obtain consumer reports from consumer reporting
        agencies is valid as long as any amounts are owed on the contract. I
        certify that the information provided by me is true and complete to the
        best of my knowledge and belief.
      </p>
      <p>
        SPECIAL NOTE TO BORROWERS WITH COSIGNERS: YOU MUST GET THE PERMISSION OF
        YOUR COSIGNER TO ACCESS HIS/HER CREDIT. By checking the box you
        acknowledge that you have notified your Cosigner that his/her credit is
        being accessed for your retail installment contract and that he/she has
        read and agreed to this Credit Check Agreement. VIOLATORS WILL BE
        PROSECUTED.
      </p>
    </Wrapper>
  );
};

export default CreditCheck;
