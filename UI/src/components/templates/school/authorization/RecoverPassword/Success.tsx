import React from "react";
import styled from "styled-components";
import { H3, Text } from "../../../../atoms/Typography";
import { LinkButton } from "../../../../atoms/Buttons/Regular";
import { routes } from "../../../../../routes/School/routes";
import { header, main, container } from "../styles";

const Wrapper = styled.div`
  ${header}
  ${main}  
  ${container}

  button {
    margin-top: 24px;
    max-width: ;
  }
`;

const Success = () => {
  return (
    <Wrapper>
      <H3 className="heading">Thank you! Your Password is Updated.</H3>
      <Text className="subtitle">
        Your Password was successfully updated. You can switch to Log In.
      </Text>
      <div className="container">
        <LinkButton to={routes.LOGIN} className="contained">
          log in
        </LinkButton>
      </div>
    </Wrapper>
  );
};

export default Success;
