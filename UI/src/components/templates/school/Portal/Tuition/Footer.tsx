import React from "react";
import styled from "styled-components";
import SubmitButton from "../../../../molecules/Buttons/SubmitButton";
import SaveAppBtn from "../../../../molecules/Buttons/SaveApplication";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 12px 24px;

  .enterIcon path {
    fill: var(--color-primary-green-1);
  }
`;

const Footer = ({
  savingApplication,
  onSaveApplication,
  onSubmitFrom,
  loading,
  disabled,
  submitBtnTitle = "continue",
}: any) => {
  return (
    <Wrapper>
      <SaveAppBtn
        type="submit"
        loading={savingApplication}
        onClick={onSaveApplication}
      />

      <SubmitButton
        type="button"
        disabled={disabled}
        onClick={onSubmitFrom}
        className="contained"
        loading={loading}
      >
        {submitBtnTitle}
      </SubmitButton>
    </Wrapper>
  );
};

export default Footer;
