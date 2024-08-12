import React from "react";
import styled from "styled-components";
import Stepper from "../../../components/organisms/Steppers/Horizontal";
import { useStepper } from "../../../contexts/stepper";

const Wrapper = styled.div`
  padding: 24px 30px;
  background: #fff;
  width: 276px;
  box-sizing: border-box;
`;

const Navigation = () => {
  const { state } = useStepper();
  return (
    <Wrapper>
      <Stepper steps={state} />
    </Wrapper>
  );
};

export default Navigation;
