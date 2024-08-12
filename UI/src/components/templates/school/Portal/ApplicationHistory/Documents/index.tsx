import React from "react";
import styled from "styled-components";
import { circle } from "../../../../../atoms/Elements/Circle";
import { ReactComponent as Icon } from "../../../../../../assets/svgs/list.svg";
import { documents } from "./config";
import DownLoadButton from "../../../../../molecules/Controllers/Download";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
`;

const DocumentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  border: 1px solid var(--color-gray-3);
  padding: 24px;
  background: #fff;

  .label-wrapper {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .label {
    font-weight: 700;
    font-size: 12px;
  }
  .circle {
    ${circle}
    & svg {
      width: 12px;
      height: 13px;
    }
  }
`;

const Documents = () => {
  return (
    <Wrapper className="content-wrapper">
      {documents.map((item) => {
        return (
          <DocumentWrapper key={item.id}>
            <div className="label-wrapper">
              <div className="circle">
                <Icon />
              </div>
              <div className="label">{item.label}</div>
            </div>
            <DownLoadButton link={item.value} />
          </DocumentWrapper>
        );
      })}
    </Wrapper>
  );
};

export default Documents;
