import React, { useState } from "react";
import {
  initForm,
  applicationInformation,
  schoolInformation,
  address,
} from "./config";
import Wrapper from "../styles";
import { validateApplicationInfo } from "./validation";
import { mockRequest } from "../../../../../../utils/mockRequest";
import Footer from "../Footer";
import Form from "./Form";
import { useForm } from "../../../../../../hooks/form-control";

const CreditPullAuthorization = ({ onStepChange }: any) => {
  const { form, onChangeHandler, setForm } = useForm(initForm());
  const [loading, setLoading] = useState(false);
  const [savingApplication, setSavingApplication] = useState(false);

  const onSubmitFrom = async () => {
    const [applicationFormIsValid, updatedApplicationForm] =
      validateApplicationInfo(form);
    if (applicationFormIsValid) {
      setLoading(true);
      await mockRequest();
      setLoading(false);
      onStepChange(true);
    } else {
      setForm(updatedApplicationForm);
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
    disabled: !form.approval.value,
    loading,
    submitBtnTitle: "authorize credit pull",
  };

  const formProps = {
    onChange: onChangeHandler,
    applicationInformation: applicationInformation(form),
    schoolInformation: schoolInformation(form),
    applicantAddress: address(form),
    coSigner: {
      value: form.coSigner.value,
      name: "coSigner",
      label: "Add cosigner?",
    },
    creditPullApprove: {
      value: form.approval.value,
      name: "approval",
      label:
        "I have received approval from the borrower (and cosigner, if applicable) to pull credit reports on their behalf. I understand that by submitting this pre-approval request, I will be initiating a hard credit inquiry, which may affect the borrower’s (and cosigner’s, if applicable) credit score.",
    },
  };

  return (
    <Wrapper>
      <Form {...formProps} />
      <Footer {...footerProps} />
    </Wrapper>
  );
};

export default CreditPullAuthorization;
