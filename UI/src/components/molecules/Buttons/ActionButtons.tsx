import React from "react";
import styled from "styled-components";
import GoBackButton from "./GoBack";
import { ReactComponent as EditIcon } from "../../../assets/svgs/pencil.svg";
import { ReactComponent as CheckedIcon } from "../../../assets/svgs/checked.svg";
import { ReactComponent as CancelIcon } from "../../../assets/svgs/error.svg";
import { ReactComponent as ExpandIcon } from "../../../assets/svgs/expand.svg";
import { circle } from "../../atoms/Elements/Circle";
import { Rounded } from "../../atoms/Buttons/Action";
import { ReactComponent as Chevron } from "../../../assets/svgs/chevron-down.svg";

const DownBtn = styled(Rounded)`
  width: 24px;
  height: 24px;
`;

const Button = styled.button`
  ${circle}
  width: 32px;
  height: 32px;

  cursor: pointer;

  &.edit {
    border: none;
    background: transparent;
    border-radius: 0;
    width: 16px;
    height: 16px;

    & svg {
      & path {
        fill: var(--color-primary-dark-1);
      }
    }
  }

  &.save {
    background: var(--color-primary-green-1);
    & svg {
      height: 7px;
      width: 11px;
      & path {
        fill: #fff;
      }
    }
  }

  &.cancel {
    background: var(--color-primary-green-5);
    & svg {
      height: 13px;
      width: 13px;
    }
    & path {
      fill: var(--color-primary-green-1);
    }
  }
  .preloader {
    margin-top: 3px;
  }
`;

const TransparentBtn = styled.button`
  border: none;
  background: transparent;

  &.expand {
    & svg {
      width: 10px;
      & path {
        fill: var(--color-primary-green-1);
      }
    }
  }

  &.save {
    & svg {
      width: 14px;
      height: 18px;
      & path {
        fill: var(--color-primary-green-1);
      }
    }
  }

  &.cancel {
    & svg {
      width: 14px;
      height: 18px;
      path {
        fill: var(--color-functional-red-1);
      }
    }
  }
`;

const ActionButton = ({
  onClick,
  type,
}: {
  onClick?: any;
  type: "goback" | "edit" | "save" | "cancel" | "expand" | "down";
}) => {
  const renderIcon = () => {
    if (type === "edit") {
      return (
        <Button className="edit" onClick={onClick}>
          <EditIcon />
        </Button>
      );
    }
    if (type === "save") {
      return (
        <TransparentBtn className="save" onClick={onClick}>
          <CheckedIcon />
        </TransparentBtn>
      );
    }
    if (type === "expand") {
      return (
        <TransparentBtn className="expand" type="button" onClick={onClick}>
          <ExpandIcon />
        </TransparentBtn>
      );
    }
    if (type === "down") {
      return (
        <DownBtn className="expand" type="button" onClick={onClick}>
          <Chevron />
        </DownBtn>
      );
    }
    if (type === "cancel") {
      return (
        <TransparentBtn className="cancel" onClick={onClick}>
          <CancelIcon />
        </TransparentBtn>
      );
    }
    if (type === "goback") {
      return <GoBackButton />;
    }

    return <></>;
  };
  return renderIcon();
};

export default ActionButton;
