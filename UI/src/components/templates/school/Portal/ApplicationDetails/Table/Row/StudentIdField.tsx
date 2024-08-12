import React from "react";
import styled from "styled-components";
import { ReactComponent as AddIcon } from "../../../../../../../assets/svgs/add.svg";
import ViewField from "./ViewField";

const Button = styled.button`
  color: var(--color-primary-green-1);
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: upperCase;
  font-size: 10px;
  font-weight: 700;
  & span {
    margin-top: 1px;
  }
  & svg {
    width: 16px;
    & path {
      fill: var(--color-primary-green-1);
    }
  }
`;

const EditStudentId = ({
  value,
  onClick,
  isEditable,
  ...props
}: {
  value: string;
  onClick: any;
  isEditable: boolean;
}) => {
  const studentId = !isEditable && !value ? "--" : value;
  if (!studentId) {
    return (
      <Button type="button" onClick={onClick}>
        <AddIcon />
        <span>Add student id</span>
      </Button>
    );
  }
  return <ViewField {...props} value={studentId} onClick={onClick} />;
};

export default EditStudentId;
