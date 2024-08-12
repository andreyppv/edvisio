/*eslint-disable*/
import React from "react";
import styled from "styled-components";
import DatePicker from "../../../../../../molecules/Controllers/DatePicker/Placeholder-label";
import Checkbox from "../../../../../../molecules/Controllers/CheckBox/Custom";
import { datePickerSmall } from "../../../../../../molecules/Controllers/DatePicker/styles";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  .section-wrapper {
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    border-top: 1px solid var(--color-gray-3);
    & .label,
    & .checkbox-label {
      font-size: 14px;
      font-weight: 600;
    }
  }

  ${datePickerSmall}
`;

const Header = ({ onChange, form, isEd2go }: any) => {
  return (
    <Wrapper>
      <div className="section-wrapper">
        <Checkbox
          className="checkbox-label"
          onChange={onChange}
          value={form?.allowEmptyPeriod}
          name="allowEmptyPeriod"
          label="Allow empty Period Start Date and Period End Date"
        />
      </div>
      {isEd2go ? (
        <div className="section-wrapper">
          <div className="label">Set Period Start Date</div>
          <DatePicker
            onChange={onChange}
            value={form?.startDate}
            name="startDate"
          />
          <div className="label">Set Period End Date</div>

          <DatePicker
            onChange={onChange}
            value={form?.endDate}
            name="endDate"
          />
        </div>
      ) : (
        ""
      )}
    </Wrapper>
  );
};

export default Header;
