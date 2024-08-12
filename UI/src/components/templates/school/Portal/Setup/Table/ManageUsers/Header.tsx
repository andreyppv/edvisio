/*eslint-disable*/
import React from "react";
import styled from "styled-components";
import { Subtitle as Heading } from "../../../../../../atoms/Typography";
import { Button } from "../../../../../../atoms/Buttons/Regular";
import { ReactComponent as Icon } from "../../../../../../../assets/svgs/add.svg";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;

  .contained {
    display: flex;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: upperCase;
  }
`;

const Header = ({ onClick }: any) => {
  return (
    <Wrapper>
      <Heading>Manage Users</Heading>
      <Button className="contained" onClick={onClick}>
        add users
        <Icon />
      </Button>
    </Wrapper>
  );
};

export default Header;
