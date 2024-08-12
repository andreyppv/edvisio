import React from "react";
import styled from "styled-components";
import { H3 as Heading } from "../../../../atoms/Typography";
import Note from "./Note";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 70px;
  p {
    margin-bottom: 12px;
    font-size: 14px;
  }
  & .marker-bold li::marker {
    font-weight: 600;
  }
  ul {
    padding-left: 20px;
  }
  .roman {
    list-style-type: lower-roman;
  }

  .circle {
    list-style-type: disc;
  }
`;

const Consent = () => {
  return (
    <Wrapper>
      <Heading>TuitionFlex Program E-sign Disclosure and Consent</Heading>
      <ul>
        <li>
          <p>
            In order to apply for and obtain credit you must sign the
            appropriate documents required by your applicable TuitionFlex
            product. Required documents per product are as follows:
          </p>
          <ul className="roman">
            <li>
              <p>TuitionEase:</p>
              <ul className="circle">
                <li>
                  <p>Application and Terms and Conditions</p>
                </li>
              </ul>
            </li>
            <li>
              <p>TuitionExtend and TuitionFlex:</p>
              <ul className="circle">
                <li>
                  <p>Application and Retail Installment Contract</p>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
      <div className="content-main">
        <p>
          In addition, the required documents may include Application
          Disclosures, Approval Disclosures, Final Disclosures, and Adverse
          Action Notices or Risk Based Pricing Disclosures where applicable. If
          you will be a cosigner for someone who obtains a TuitionFlex product,
          you will receive only those required documents that apply to you.
          These documents contain important information about the terms of the
          TuitionFlex Program and your rights and obligations. You must read all
          these documents carefully.
        </p>
        <ul>
          <li>
            <p>
              You may apply for and obtain credit through the TuitionFlex
              Program either through an on-line process using electronic
              documents, disclosures and signatures, or by returning a signed
              paper credit application and contract document to us via
              facsimile.
            </p>
            <p>
              If you wish to complete this process electronically, we will need
              your consent to do so after you review this disclosure.
            </p>
          </li>
        </ul>
        <p>
          You may obtain a paper of copy of any electronic records by logging on
          to this website and printing a copy. You may request a copy of any
          electronic records that you may have used or received by contacting us
          at: 866-758-7123. We will provide you with paper copies at no charge.
        </p>
        <p>
          If you consent to use electronic documents, disclosures and
          signatures, your consent will apply to all of our interactions and
          transactions relating to the documents listed above. Your consent will
          also apply to all interactions and transactions with any third-party
          engaged by us to facilitate our extension of credit to you. You will
          not be mailed a copy of any of the documents relating to the
          TuitionFlex Program.
        </p>
        <ul className="roman marker-bold">
          <li>
            <p>
              Has an approved Operating System - Microsoft® Windows 2000, XP or
              Vista, a desktop version of Microsoft® Windows or Mac OS X.
            </p>
          </li>
          <li>
            <p>
              Has a compatible internet browser - Microsoft® Internet Explorer
              6.0 or higher, Firefox
            </p>
          </li>
          <li>
            <p>
              Has the required supporting software - Adobe® Acrobat Reader 6.0
              or higher
            </p>
            <ul className="circle">
              <li>
                <p>
                  You must also have access to a printer and the ability to
                  download information, a connection to the Internet and a
                  working email address. You should download, print and retain a
                  copy of this document for your records and to confirm that you
                  have the necessary hardware and software.
                </p>
              </li>
              <li>
                <p>
                  You may withdraw your consent to receive and sign these
                  documents electronically by (i) exiting this online session
                  any time prior to submitting your application for processing,
                  (ii) calling 866-758-7123 to withdraw your application or
                  (iii) sending an email with a request to withdraw your
                  application to customerservice@tuitionflex.com.
                </p>
              </li>
              <li>
                <p>
                  You should keep us informed of any change in your email or
                  postal address. You can update that information by logging on
                  to this website and providing us with your updated
                  information. You may also send your updated information to our
                  address shown above.
                </p>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <Note />
    </Wrapper>
  );
};

export default Consent;
