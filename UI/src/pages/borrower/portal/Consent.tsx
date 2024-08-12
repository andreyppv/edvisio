import React, { useState } from "react";
import styled from "styled-components";
import ESignConsent from "../../../components/templates/borrower/portal/EsignConsent";
import Checkbox from "../../../components/molecules/Controllers/CheckBox/Custom";
import SaveButton from "../../../components/molecules/Buttons/SaveApplication";
import { mockRequest } from "../../../utils/mockRequest";
import SubmitButton from "../../../components/molecules/Buttons/SubmitButton";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 70px;
  .checkbox-label {
    font-weight: 600;
    font-size: 14px;
  }
  .buttons-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;
  }
`;

const Consent = ({
  isActive,
  moveToNextStep,
}: {
  isActive: boolean;
  moveToNextStep: any;
}) => {
  const [agree, setAgree] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isActive) {
    return <></>;
  }

  const onSubmitHandler = async () => {
    setLoading(true);
    await mockRequest();
    moveToNextStep();
  };

  const onSaveHandler = async () => {
    setSaving(true);
    await mockRequest();
  };
  return (
    <Wrapper>
      <ESignConsent />
      <Checkbox
        onChange={(e: any) => setAgree(e.target.value)}
        value={agree}
        label="I agree to use electronic documents and signatures"
      />
      <div className="buttons-wrapper">
        <SaveButton onClick={onSaveHandler} loading={saving} />
        <SubmitButton
          onClick={onSubmitHandler}
          loading={loading}
          disabled={!agree}
          className="contained"
        >
          Continue
        </SubmitButton>
      </div>
    </Wrapper>
  );
};

export default Consent;
