import React from "react";
import styled from "styled-components";
import { Button } from "../atoms/Buttons/Regular";
import { ReactComponent as Logo } from "../../assets/svgs/bell.svg";
import SubmitBtn from "../molecules/Buttons/SubmitButton";

const Wrapper = styled.div`
  padding: 40px;
  section {
    display: flex;
    column-gap: 20px;
    margin-bottom: 20px;
  }
`;

const Guide = () => {
  return (
    <Wrapper>
      <section>
        <Button className="contained">Enabled</Button>
        <Button className="outlined">Outlined</Button>
        <Button className="text">Text</Button>
        <Button className="contained icon">
          <Logo fill="#fff" />
          With Icon
        </Button>
      </section>
      <section>
        <p>Button with loader:</p>
        <SubmitBtn>Submit</SubmitBtn>
        <SubmitBtn loading>loading...</SubmitBtn>
      </section>
    </Wrapper>
  );
};

export default Guide;
