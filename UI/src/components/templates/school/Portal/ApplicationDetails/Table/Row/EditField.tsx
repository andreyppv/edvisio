import React, { useState } from "react";
import styled from "styled-components";
import ActionButton from "../../../../../../molecules/Buttons/ActionButtons";
import { mockRequest } from "../../../../../../../utils/mockRequest";
import Loader from "../../../../../../molecules/Loaders/LoaderWrapper";
import { validate } from "./validation";
import { editField as fieldStyles } from "./styles";

const Wrapper = styled.div`
  ${fieldStyles}

  & .textField .error {
    position: absolute;
    left: 140px;
    width: 100%;
    margin: 0;
    pointer-events: none;
    line-height: 1;
  }
`;

const EditField = ({
  value,
  component: Input,
  name,
  onCancel,
  onChange,
  ...props
}: {
  value: string;
  component: any;
  name: string;
  onCancel: any;
  fetchData: any;
  onChange: any;
}) => {
  const [form, setForm] = useState({ value, message: "" });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e: any) => {
    setForm({ value: e.target.value, message: "" });
  };

  const onSubmit = async () => {
    const [isValid, updatedForm] = validate(form, name);
    if (!isValid) {
      setForm(updatedForm);
    } else {
      setLoading(true);
      await mockRequest();
      setLoading(false);
      onChange({ value: form.value, fieldName: name });
      onCancel();
    }
  };

  return (
    <Wrapper className="edit-mode field">
      <div className="edit-mode-input-wrapper">
        <Loader loading={loading} size="3">
          <Input
            name={name}
            value={form.value}
            message={form.message}
            onChange={onChangeHandler}
            {...props}
          />
        </Loader>
      </div>
      <div className="buttons-wrapper">
        <ActionButton onClick={onSubmit} type="save" />
        <ActionButton onClick={onCancel} type="cancel" />
      </div>
    </Wrapper>
  );
};

export default EditField;
