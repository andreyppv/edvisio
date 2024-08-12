import React from "react";
import styled from "styled-components";
import { renderFields } from "./config";
import SubmitButton from "../../../../../../../molecules/Buttons/SubmitButton";
import { Button } from "../../../../../../../atoms/Buttons/Regular";
import Header from "../../../../../../../molecules/Modal/Header/Regular";

const Wrapper = styled.div`
  max-width: 1276px;
  box-sizing: border-box;
  form {
    width: 100%;
    padding: 44px;
    & .fields-wrapper {
      display: grid;
      grid-template-columns: repeat(4, minmax(180px, 290px));
      grid-gap: 12px;
      align-items: center;
      margin: 44px 0;

      & .checkbox-label {
        font-weight: 600;
        font-size: 14px;
      }
    }

    & .button-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 24px;
      margin-top: 32px;
    }
  }
`;

const Form = ({
  closeModal,
  onSubmitHandler,
  form,
  onChangeHandler,
  loading,
  isEditing,
}: any) => {
  return (
    <Wrapper>
      <form onSubmit={onSubmitHandler}>
        <Header
          text={`${isEditing ? "Edit" : "Add"} Academic Period`}
          onClose={closeModal}
        />
        <div className="fields-wrapper">
          {renderFields(form).map(({ component: Component, ...field }) => {
            return (
              <div className="form-field" key={field.name}>
                <Component {...field} onChange={onChangeHandler} />
              </div>
            );
          })}
        </div>
        <div className="button-wrapper">
          <SubmitButton loading={loading} type="submit">
            Save
          </SubmitButton>
          <Button type="button" onClick={closeModal} className="outlined">
            cancel
          </Button>
        </div>
      </form>
    </Wrapper>
  );
};

export default Form;
