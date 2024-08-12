import React from "react";
import styled from "styled-components";
import DropDown from "../../Dropdown/ClickMenu";
import { ReactComponent as ExpandIcon } from "../../../../assets/svgs/expand.svg";
import Menu from "./MenuList";

const Button = styled.div`
  border: none;
  background: transparent;
  svg path {
    fill: var(--color-primary-green-1);
  }
`;

const DropMenu = (props: any) => {
  return (
    <DropDown
      menu={Menu}
      {...props}
      button={
        <Button>
          <ExpandIcon />
        </Button>
      }
    />
  );
};

export default DropMenu;
