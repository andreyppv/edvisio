import React from "react";
import styled from "styled-components";
import { ReactComponent as EditIcon } from "../../../../assets/svgs/pencil.svg";

const Wrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .line-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .line {
      position: relative;
      width: 100%;
      height: 3px;
      background: var(--color-gray-3);

      &.completed {
        background: var(--color-primary-green-1);
      }
    }
    .step {
      width: 16px;
      height: 16px;
      border: 4px solid var(--color-gray-3);
      border-radius: 50%;
      background: #fff;

      &.active {
        border-color: var(--color-primary-green-1);
      }

      &.completed {
        border-color: var(--color-primary-green-1);
        background: var(--color-primary-green-1);
      }
    }
  }

  .labels-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 10px;
      text-transform: upperCase;
      font-weight: 700;

      &.active {
        color: var(--color-primary-green-1);
      }
    }

    .label:first-child {
      margin-left: 40px;
    }

    .label:last-child {
      margin-right: 40px;
    }
  }
`;

const EditBtn = styled.button`
  background: transparent;
  border: none;
  svg {
    width: 12px;
    height: 12px;
    & path {
      fill: var(--color-primary-green-1);
    }
  }
`;

const Stepper = ({ step, onStepChange }) => {
  const completed = step === 2;
  return (
    <Wrapper>
      <div className="line-wrapper">
        <div className={`step ${!completed ? "active" : "completed"} `} />
        <div className={`line ${completed ? "completed" : ""}`} />
        <div className={`step ${completed ? "active" : ""} `} />
      </div>
      <div className="labels-wrapper">
        <div className="label active">
          step 1{" "}
          {completed && (
            <EditBtn
              type="button"
              className="edit-btn"
              onClick={() => onStepChange(1)}
            >
              <EditIcon />
            </EditBtn>
          )}
        </div>
        <div className={`label ${completed ? "active" : ""} `}>step 2</div>
      </div>
    </Wrapper>
  );
};

export default Stepper;
