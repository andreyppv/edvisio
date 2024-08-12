import React, { useState } from "react";
import styled from "styled-components";
import { Subtitle as Heading, Text } from "../../../../../atoms/Typography";
import { ReactComponent as WarningIcon } from "../../../../../../assets/svgs/alert.svg";
import SubmitButton from "../../../../../molecules/Buttons/SubmitButton";
import { mockRequest } from "../../../../../../utils/mockRequest";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 600px;
  height: 100%;

  .buttons-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 24px;
    margin-top: auto;
  }
`;

const NoteWrapper = styled.div`
  position: relative;
  padding: 16px;
  width: 100%;
  overflow: hidden;
  border-radius: 4px;
  background: var(--color-functional-blue-5);
  .background-img {
    position: absolute;
    z-index: 1;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 190px;
    opacity: 0.3;
  }

  .icon path {
    fill: var(--color-functional-blue-1);
  }

  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 100;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & .heading {
      color: var(--color-functional-blue-1);
    }
  }

  .separator-line {
    width: 100%;
    height: 3px;
    background: var(--color-functional-blue-1);
  }
`;

const Note = () => {
  return (
    <NoteWrapper>
      <div className="content">
        <div className="header">
          <Heading className="heading">NOTE</Heading>
          <WarningIcon className="icon" />
        </div>
        <div className="separator-line" />
        <div className="footer">
          <Text>
            If you choose the Save and Exit Option, the application will need to
            be completed within 60 days. Otherwise, the application will be
            withdrawn.
          </Text>
        </div>
      </div>
      <WarningIcon className="background-img icon" />
    </NoteWrapper>
  );
};

const Approved = () => {
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    setSubmitting(true);
    await mockRequest();
    setSubmitting(false);
  };

  const onExit = async () => {
    setSaving(true);
    await mockRequest();
    setSaving(false);
  };
  return (
    <Wrapper>
      <Heading className="heading">
        Borrower has been approved for tfplus
      </Heading>
      <Text>Borrower has been approved for tfplus</Text>
      <Note />
      <div className="buttons-wrapper">
        <SubmitButton onClick={onExit} className="outlined" loading={saving}>
          no. save and exit
        </SubmitButton>
        <SubmitButton
          onClick={onSubmit}
          className="contained"
          loading={submitting}
        >
          Yes. continue with tfplus
        </SubmitButton>
      </div>
    </Wrapper>
  );
};

export default Approved;
