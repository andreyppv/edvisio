/*eslint-disable*/
import React, { useState, useEffect } from "react";

export const StepperContext = React.createContext();

export const StepperProvider = ({
  children,
  steps,
  isDeclined = false,
  initStep = 0,
}) => {
  const [state, setState] = useState(steps());
  const [currentStep, setCurrentStep] = useState(0);

  const getScreenData = async () => {
    const curStep = initStep;
    const updatedState = steps(isDeclined).map((item) => {
      const updatedItem = { ...item };
      if (isDeclined) {
        // IF DECLINED - REMOVES EDIT BUTTONS FROM EACH STEP
        updatedItem.completed = false;
      } else if (item.number < curStep) {
        updatedItem.completed = true;
      }
      if (item.number === curStep) {
        updatedItem.active = true;
      } else {
        updatedItem.active = false;
      }
      return updatedItem;
    });

    setCurrentStep(curStep);
    setState(updatedState);
  };

  useEffect(() => {
    if (initStep) {
      getScreenData();
    }
  }, [initStep]);

  const goToStep = (stepNumber) => {
    const updatedState = state.map((item) => {
      const newItem = { ...item };
      if (item.number === stepNumber) {
        newItem.active = true;
        setCurrentStep(newItem.number);
      } else {
        newItem.active = false;
      }
      return newItem;
    });
    setState([...updatedState]);
  };

  const moveToNextStep = () => {
    const index = state.findIndex((item) => item.number === currentStep);
    const newState = [...state];
    newState[index].active = false;
    newState[index].completed = true;
    newState[index + 1].active = true;
    const nextStep = newState[index + 1].number;
    setCurrentStep(nextStep);
    setState(newState);
  };

  const expose = {
    goToStep,
    state,
    moveToNextStep,
    currentStep,
  };
  return (
    <StepperContext.Provider value={expose}>{children}</StepperContext.Provider>
  );
};

export const useStepper = () => {
  const context = React.useContext(StepperContext);

  if (context === undefined) {
    throw new Error("stepper must be used within a StepperProvider");
  }
  return context;
};
