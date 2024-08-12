import React from "react";
import { Subtitle as Heading } from "../../../../../atoms/Typography";

const Section = ({ rows, onChange }: any) => {
  return rows.map(({ component: Component, ...item }: any) => {
    return <Component key={item?.name} {...item} onChange={onChange} />;
  });
};

const Form = ({
  applicationInformation,
  schoolInformation,
  financialAidInformation,
  onChange,
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
        <Heading className="heading">school Information</Heading>
        <div className="school-information-form">
          <Section rows={schoolInformation} onChange={onChange} />
        </div>
      </div>
      {financialAidInformation && (
        <div className="form-wrapper">
          <Heading className="heading">financial aid information</Heading>
          <div className="school-information-form">
            <Section rows={financialAidInformation} onChange={onChange} />
          </div>
        </div>
      )}
    </>
  );
};
export default Form;
