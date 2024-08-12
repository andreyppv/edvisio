import React from "react";
import styled from "styled-components";
import {
  Subtitle as Heading,
  TextSm as Text,
} from "../../../../../../atoms/Typography";
import { Button } from "../../../../../../atoms/Buttons/Regular";
import { ReactComponent as Arrow } from "../../../../../../../assets/svgs/send.svg";
import { formatDate } from "../../../../../../../utils/formats";

const Wrapper = styled.div`
  padding: 12px;

  .navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 16px;

    & .filters {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
`;

const LabelWrapper = styled.div`
  padding: 12px;
  background: var(--color-bg-2);
  border: 1px solid var(--color-gray-3);
  display: flex;
  align-items: center;
  border-radius: 40px;
  white-space: nowrap;

  .label {
    color: var(--color-gray-2);
    font-weight: 700;
  }

  .value {
    color: var(--color-primary-dark-1);
    font-weight: 700;
    min-width: 60px;
  }
`;

const Label = ({ value, label }: { label: string; value: any }) => {
  const val = value instanceof Date ? formatDate(value) : value;
  return (
    <LabelWrapper>
      <Text className="label">{label}</Text> &nbsp;
      <Text className="value">{val}</Text>
    </LabelWrapper>
  );
};

const Header = ({
  filtersApplied,
}: {
  filtersApplied: { value: string; label: string; id: string }[];
}) => {
  return (
    <Wrapper>
      <Heading>Application All-Inclusive Report</Heading>
      <div className="navigation">
        <div className="filters">
          {filtersApplied.map(({ label, id, value }) => {
            return value ? <Label key={id} value={value} label={label} /> : "";
          })}
        </div>
        <Button className="contained icon">
          Export
          <Arrow />
        </Button>
      </div>
    </Wrapper>
  );
};

export default Header;
