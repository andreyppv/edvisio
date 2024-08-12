import React from "react";
import { ReactComponent as EditIcon } from "../../../../assets/svgs/pencil.svg";
import { useStepper } from "../../../../contexts/stepper";
import Wrapper from "./styles";

const Step = ({
  label,
  isActive,
  isCompleted,
  isLastStep,
  number,
}: {
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  isLastStep: boolean;
  number: number;
}) => {
  const { goToStep } = useStepper();
  return (
    <Wrapper
      className={`${isLastStep ? "lastStep" : ""} ${
        isCompleted ? "completed" : ""
      } ${isActive ? "active" : ""}`}
    >
      <div className="label">{label}</div>
      {!isActive && isCompleted && (
        <button
          type="button"
          className="edit-button"
          onClick={() => goToStep(number)}
        >
          <EditIcon />
        </button>
      )}
    </Wrapper>
  );
};

const Stepper = ({ steps = [] }: any) => {
  return (
    <div>
      {steps.map((item: any, index: number) => {
        return (
          <Step
            number={item.number}
            label={item.label}
            key={item.label}
            isCompleted={item.completed}
            isActive={item.active}
            isLastStep={index === steps.length - 1}
          />
        );
      })}
    </div>
  );
};

export default Stepper;
