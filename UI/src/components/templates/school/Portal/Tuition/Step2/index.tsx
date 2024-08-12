import React, { useState } from "react";
import {
  initMailingAddressForm,
  initPermanentAddress,
  mailingAddress,
  permanentAddress,
} from "./config";
import Wrapper from "../styles";
import {
  Subtitle as Heading,
  Text as Subheading,
} from "../../../../../atoms/Typography";
import { validate } from "./validation";
import { mockRequest } from "../../../../../../utils/mockRequest";
import Footer from "../Footer";
import CheckBox from "../../../../../molecules/Controllers/CheckBox/Custom";
import ApplicationOptions from "./ApplicationOptions";

const CreditPullAuthorization = () => {
  const [mailingAddressForm, setMailingAddressForm] = useState(
    initMailingAddressForm()
  );
  const [permanentAddressForm, setPermanentAddressForm] = useState(
    initPermanentAddress()
  );
  const [loading, setLoading] = useState(false);
  const [isPermanentAddress, setIsPermanentAddress] = useState(false);
  const [savingApplication, setSavingApplication] = useState(false);

  const onChangeMailing = (e: any) => {
    const { value, name } = e.target;
    setMailingAddressForm((prevState: any) => ({
      ...prevState,
      [name]: { ...prevState[name], value, message: "" },
    }));
  };

  const onChangePermanent = (e: any) => {
    const { value, name } = e.target;
    setPermanentAddressForm((prevState: any) => ({
      ...prevState,
      [name]: { ...prevState[name], value, message: "" },
    }));
  };

  const onSubmitFrom = async () => {
    const [applicationFormIsValid, updatedApplicationForm] =
      validate(mailingAddressForm);
    if (applicationFormIsValid) {
      setLoading(true);
      await mockRequest();
      setLoading(false);
    } else {
      setMailingAddressForm(updatedApplicationForm);
    }
  };

  const onSaveApplication = async () => {
    setSavingApplication(true);
    await mockRequest();
    setSavingApplication(false);
  };

  const footerProps = {
    savingApplication,
    onSaveApplication,
    onSubmitFrom,
    loading,
  };

  return (
    <Wrapper>
      <ApplicationOptions />
      <div className="form-wrapper">
        <Heading className="heading">Applicant mailing address</Heading>
        <Subheading>Input Repayment Information</Subheading>
        <div className="mailing-address-form">
          {mailingAddress(mailingAddressForm).map(
            ({ component: Component, ...item }) => {
              return (
                <Component
                  key={item?.name}
                  {...item}
                  onChange={onChangeMailing}
                />
              );
            }
          )}
        </div>
      </div>
      <div className="form-wrapper">
        <Heading className="heading">applicant permanent address</Heading>
        <CheckBox
          onChange={(e: any) => setIsPermanentAddress(e.target.value)}
          value={isPermanentAddress}
          label="Permanent Same As Mailing?"
        />
        <div className="permanent-address-form">
          {permanentAddress(permanentAddressForm).map(
            ({ component: Component, ...item }) => {
              return (
                <Component
                  key={item?.name}
                  {...item}
                  onChange={onChangePermanent}
                />
              );
            }
          )}
        </div>
      </div>
      <Footer {...footerProps} />
    </Wrapper>
  );
};

export default CreditPullAuthorization;
