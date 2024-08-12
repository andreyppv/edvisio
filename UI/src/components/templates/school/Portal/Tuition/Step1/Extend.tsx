import React, { useState } from "react";
import {
  initForm,
  initFinancialAssistance,
  applicationInformation,
  schoolInformation,
  financialAidInformation,
} from "./config";
import Wrapper from "../styles";
import { validateApplicationInfo } from "./validation";
import { mockRequest } from "../../../../../../utils/mockRequest";
import Calculator from "../Calculation";
import Footer from "../Footer";
import Form from "./Form";
import { useForm } from "../../../../../../hooks/form-control";

const CreditPullAuthorization = ({ onStepChange }: any) => {
  const { form, onChangeHandler, setForm } = useForm({
    ...initForm(),
    ...initFinancialAssistance(),
  });
  const [loading, setLoading] = useState(false);
  const [savingApplication, setSavingApplication] = useState(false);

  const onSubmitFrom = async () => {
    const [applicationFormIsValid, updatedApplicationForm] =
      validateApplicationInfo(form);
    if (applicationFormIsValid) {
      setLoading(true);
      await mockRequest();
      setLoading(false);
      onStepChange(2);
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
    loading,
  };

  return (
    <Wrapper>
      <Form
        onChange={onChangeHandler}
        applicationInformation={applicationInformation(form)}
        schoolInformation={schoolInformation(form)}
        financialAidInformation={financialAidInformation(form)}
      />
      <Calculator />
      <Footer {...footerProps} />
    </Wrapper>
  );
};

export default CreditPullAuthorization;
