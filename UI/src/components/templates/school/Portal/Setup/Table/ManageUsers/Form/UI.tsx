import React from "react";
import styled from "styled-components";
import { renderFields, renderPasswordFields } from "./config";
import Checkbox from "../../../../../../../molecules/Controllers/CheckBox/Custom";
import SubmitButton from "../../../../../../../molecules/Buttons/SubmitButton";
import { Button } from "../../../../../../../atoms/Buttons/Regular";
import Header from "../../../../../../../molecules/Modal/Header/Regular";

const Wrapper = styled.div`
  max-width: 1276px;
  box-sizing: border-box;
  form {
    padding: 44px;
    width: 100%;
    & .form-fields-wrapper {
      margin: 44px 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    & .fields-section-wrapper {
      display: grid;
      grid-template-columns: repeat(4, minmax(180px, 290px));
      grid-gap: 12px;
    }

    .checkboxField {
      font-size: 14px;
      font-weight: 600;
      align-items: center;
    }

    & .button-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 24px;
      margin-top: 32px;
    }
  }
`;

const Heading = styled.h5`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary-dark-1);
  text-transform: upperCase;
`;

const Form = ({
  closeModal,
  onSubmitHandler,
  form,
  onChangeHandler,
  access,
  setAccess,
  loading,
  isPassword,
  setIsPassword,
  isEditing,
}: any) => {
  return (
    <Wrapper>
      <form onSubmit={onSubmitHandler}>
        <Header
          text={`${isEditing ? "Edit" : "Add"} User`}
          onClose={closeModal}
        />
        <div className="form-fields-wrapper">
          <Heading>information</Heading>
          <div className="fields-section-wrapper">
            {renderFields(form).map(({ component: Component, ...field }) => {
              return (
                <div className="form-field" key={field.name}>
                  <Component {...field} onChange={onChangeHandler} />
                </div>
              );
            })}
          </div>
          {isEditing ? (
            <Checkbox
              value={form?.ed2go?.value}
              name="ed2go"
              onChange={onChangeHandler}
              label="Add user to ed2go school group"
            />
          ) : (
            ""
          )}
          <Heading>password</Heading>
          {isEditing ? (
            <Checkbox
              value={isPassword}
              onChange={(e: any) => setIsPassword(e.target.value)}
              label="Change Password"
            />
          ) : (
            ""
          )}
          <div className="fields-section-wrapper">
            {renderPasswordFields(form).map(
              ({ component: Component, ...field }) => {
                return (
                  <div className="form-field" key={field.name}>
                    <Component
                      {...field}
                      onChange={onChangeHandler}
                      disabled={!isPassword}
                    />
                  </div>
                );
              }
            )}
          </div>
          <Heading>school roles</Heading>
          <Checkbox
            value={access}
            onChange={(e: any) => setAccess(e.target.value)}
            label="All School Access"
          />
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
