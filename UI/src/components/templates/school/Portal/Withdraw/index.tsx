import React, { useState } from "react";
import SubmitButton from "../../../../molecules/Buttons/SubmitButton";
import { Button } from "../../../../atoms/Buttons/Regular";
import { mockRequest } from "../../../../../utils/mockRequest";
import RadioGroup from "../../../../molecules/Controllers/RadioButton";
import { ReactComponent as CrossIcon } from "../../../../../assets/svgs/cross.svg";
import FormWrapper from "./styles";

const radioButtons = [
  { id: "1", label: "No longer needed", value: "not needed" },
  { id: "2", label: "No longer eligible", value: "not eligible" },
  { id: "3", label: "Other", value: "other" },
];

const Form = ({ closeModal }: any) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const onChangeHandler = (e: any) => {
    const { value } = e.target;
    setReason(value);
  };

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await mockRequest();
    setLoading(false);
  };

  return (
    <FormWrapper onSubmit={onSubmitHandler}>
      <div className="header">
        <div className="placeholder" />
        <h5 className="title">withdraw the application</h5>
        <button type="button" onClick={closeModal} className="close-btn">
          <CrossIcon />
        </button>
      </div>
      <div className="heading">Please, select a reason for withdrawal</div>
      <div className="body">
        <RadioGroup
          options={radioButtons}
          currentSelection={reason}
          onChange={onChangeHandler}
        />
      </div>
      <div className="footer">
        <SubmitButton type="submit" className="contained" loading={loading}>
          Withdraw
        </SubmitButton>
        <Button type="button" onClick={closeModal} className="outlined">
          Cancel
        </Button>
      </div>
    </FormWrapper>
  );
};

export default Form;
