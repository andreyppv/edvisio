import React, { useState } from "react";
import styled from "styled-components";
import { renderFields, initForm } from "./config";
import { useForm } from "../../../../../hooks/form-control";
import { mockRequest } from "../../../../../utils/mockRequest";
import { validate } from "./validate";
import SubmitButton from "../../../../molecules/Buttons/SubmitButton";
import SaveAppBtn from "../../../../molecules/Buttons/SaveApplication";
import { Subtitle as Heading } from "../../../../atoms/Typography";
import { useStepper } from "../../../../../contexts/stepper";

const Form = styled.form`
  .buttons-wrapper,
  .fields-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;
  }

  .fields-wrapper {
    margin: 70px 0;
    & .heading {
      grid-column: 1 / -1;
      text-transform: upperCase;
      color: var(--color-gray-2);
      margin: 0;
    }

    & .textField {
      &:nth-child(4),
      &:nth-child(5) {
        grid-column: 1 / -1;
      }
    }
  }
`;

const SelectSchoolForm = () => {
  const { form, setForm, onChangeHandler } = useForm(initForm());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { moveToNextStep } = useStepper();

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();

    const [isValid, updatedForm] = validate(form);
    if (isValid) {
      setLoading(true);
      await mockRequest();
      setLoading(false);
      moveToNextStep();
    } else {
      setForm(updatedForm);
    }
  };

  const onSaveApp = async () => {
    setSaving(true);
    await mockRequest();
    setSaving(false);
  };

  return (
    <Form onSubmit={onSubmitHandler}>
      <div className="fields-wrapper">
        <Heading className="heading">School Information</Heading>
        {renderFields(form).map(({ component: Component, ...field }) => {
          return (
            <Component {...field} key={field.name} onChange={onChangeHandler} />
          );
        })}
      </div>
      <div className="buttons-wrapper">
        <SaveAppBtn onClick={onSaveApp} loading={saving} />
        <SubmitButton className="contained" type="submit" loading={loading}>
          Continue
        </SubmitButton>
      </div>
    </Form>
  );
};

export default SelectSchoolForm;
