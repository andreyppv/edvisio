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

const Consent = () => {
  return (
    <Wrapper>
      <Heading>Communication Consent</Heading>
      <p>
        You agree that we may monitor and record telephone calls regarding your
        account to assure the quality of our service or for other reasons. You
        agree that we may call you, using an automatic telephone dialing system
        or otherwise, leave you a voice, prerecorded, or artificial voice
        message, or send you a text, e-mail, or other electronic message for any
        purpose related to the servicing and collection of your account with us
        (each a &quot;Communication&quot;). You agree that we may send a
        Communication to any telephone numbers, including cellular telephone
        numbers, or e-mail addresses you provided to us in connection with the
        origination of this Agreement or at any time in the future. You
        acknowledge and confirm that you have the authority to provide the
        consent because you are either the subscriber of the telephone number(s)
        or you are the non-subscriber customary user who has authority to
        provide the consent. You also agree that we may include your personal
        information in a Communication. You agree that we will not charge you
        for a Communication, but your service provider may. In addition, you
        understand and agree that we may always communicate with you in any
        manner permissible by law that does not require your prior consent.
      </p>
    </Wrapper>
  );
};

export default Consent;
