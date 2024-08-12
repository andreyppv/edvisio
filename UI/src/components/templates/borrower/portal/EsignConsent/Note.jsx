import React from "react";
import styled from "styled-components";
import { ReactComponent as WarningIcon } from "../../../../../assets/svgs/alert.svg";

const NoteWrapper = styled.div`
  padding: 16px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--color-functional-yellow-5);

  .note-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    font-weight: 600;
    color: var(--color-functional-yellow-1);

    & svg path {
      fill: var(--color-functional-yellow-1);
    }
  }

  .separator-line {
    width: 100%;
    height: 1px;
    background: var(--color-functional-yellow-1);
  }

  .note-footer {
    font-size: 14px;
  }
`;

const Note = () => {
  return (
    <NoteWrapper>
      <div className="note-header">
        <span>CONSENT</span>
        <WarningIcon />
      </div>
      <div className="separator-line" />
      <div className="note-footer">
        By clicking “I agree to use electronic documents and signatures” you
        acknowledge and agree that: (i) you have read this information; (ii)
        that you have the hardware and software to access the electronic records
        that we will provide to you and (iii) that you consent to use and
        receive electronic documents, disclosures and signatures.
      </div>
    </NoteWrapper>
  );
};

export default Note;
