import React from "react";
import { StepperProvider, useStepper } from "../../../contexts/stepper";
import { steps } from "./steps";
import Layout from "../../../layouts/borrower/Portal";

// import { useUserData } from "../../../contexts/user";

const Page = () => {
  const { state, moveToNextStep } = useStepper();
  const currentPage = state?.find((step: any) => step.active);
  const Component = currentPage?.component || <div />;

  return (
    <Layout steps={state}>
      <Component
        isActive={currentPage.active}
        moveToNextStep={moveToNextStep}
      />
    </Layout>
  );
};

const Component = () => {
  //   const { user } = useUserData();
  return (
    <StepperProvider steps={() => steps()} initStep={1}>
      <Page />
    </StepperProvider>
  );
};

export default Component;
