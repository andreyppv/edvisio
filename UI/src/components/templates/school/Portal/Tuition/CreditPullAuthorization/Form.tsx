import React from "react";
import { Subtitle as Heading } from "../../../../../atoms/Typography";
import CheckBox from "../../../../../molecules/Controllers/CheckBox/Custom";

const Section = ({ rows, onChange }: any) => {
  return rows.map(({ component: Component, ...item }: any) => {
    return <Component key={item?.name} {...item} onChange={onChange} />;
  });
};

const Form = ({
  applicationInformation,
  schoolInformation,
  applicantAddress,
  onChange,
  coSigner,
  creditPullApprove,
}: any) => {
  return (
    <>
      <div className="form-wrapper">
        <Heading className="heading">Applicant Information</Heading>
        <div className="application-information-form">
          <Section rows={applicationInformation} onChange={onChange} />
        </div>
      </div>
      <div className="form-wrapper">
        <Heading className="heading">Applicant Address</Heading>
        <div className="applicant-address-form">
          <Section rows={applicantAddress} onChange={onChange} />
        </div>
      </div>
      <div className="form-wrapper">
        <Heading className="heading">Applicant Address</Heading>
        <CheckBox {...coSigner} onChange={onChange} />
      </div>
      <div className="form-wrapper">
        <Heading className="heading">school Information</Heading>
        <div className="school-information-form">
          <Section rows={schoolInformation} onChange={onChange} />
        </div>
      </div>
      <div className="form-wrapper">
        <Heading className="heading">Applicant Address</Heading>
        <CheckBox
          {...creditPullApprove}
          className="credit-pull-approval-checkbox"
          onChange={onChange}
        />
      </div>
    </>
  );
};
export default Form;
