import React from "react";
import styled from "styled-components";

const Wrapper = styled.label`
  display: block;
  position: relative;
  cursor: pointer;
  font-size: inherit;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: inherit;
  text-transform: initial;
  font-weight: normal;

  .checkboxField {
    display: flex;
    align-items: flex-start;
  }

  /* Hide the browser's default checkbox */
  & input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark {
    display: block;
    position: relative;
    height: 18px;
    min-height: 18px;
    width: 18px;
    max-width: 18px;
    padding: 7px;
    margin-right: 10px;
    border-radius: 3px;
    background-color: #fff;
    border: 2px solid var(--color-gray-2);
    box-sizing: border-box;
  }

  /* On mouse-over, add a grey background color */
  &:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add background color */
  & input:checked ~ .checkmark {
    background-color: #fff;
    border-color: var(--color-gray-2);
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  & input:checked ~ .checkmark:after {
    display: block;
  }

  & input:disabled ~ .checkmark {
    opacity: 0.5;
  }

  /* Style the checkmark/indicator */
  & .checkmark:after {
    left: 5px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid var(--color-gray-2);
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;

const CheckBoxContainer = ({
  value = false,
  name,
  label,
  onChange,
  className,
  disabled = false,
}: any) => {
  return (
    <Wrapper className={className}>
      <div className="checkboxField">
        <input
          type="checkbox"
          name={name}
          disabled={disabled}
          checked={value}
          onChange={(e) =>
            onChange({
              target: { value: e.target.checked, name: e.target.name },
            })
          }
        />
        <span className="checkmark" />
        <div className="checkbox-label">{label}</div>
      </div>
    </Wrapper>
  );
};

export default CheckBoxContainer;
