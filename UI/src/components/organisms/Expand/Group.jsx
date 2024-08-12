import React, { useState } from "react";
import styled from "styled-components";
import AccordionMui from "./index";
import Button from "../../molecules/Buttons/ActionButtons";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;

  & section {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .expanded button svg {
    transform: rotate(180deg);
  }

  .expand-item {
    background: var(--color-bg-2);
    border-radius: 4px;
    padding: 12px 18px;
    border: 1px solid var(--color-gray-3);

    & .expand-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      & .heading {
        font-size: 10px;
        text-transform: upperCase;
        font-weight: 700;
      }
    }

    & .expand-content {
      padding-top: 18px;
    }
  }
`;

const AccordionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 18px;
  background: var(--color-bg-2);
`;

const Menu = ({ items }) => {
  const [expanded, setExpanded] = useState("");
  return (
    <Wrapper className="expand-wrapper">
      <AccordionWrapper className="expand-list-wrapper">
        {items.map(({ content: Content, ...item }) => {
          const open = expanded === item.id;
          return (
            <div key={item.id} className="expand-item">
              <div className={`expand-header ${open ? "expanded" : ""}`}>
                <div className="heading">{item.heading}</div>
                <Button type="down" onClick={() => setExpanded(item.id)} />
              </div>
              <AccordionMui content={Content} expanded={open} />
            </div>
          );
        })}
      </AccordionWrapper>
    </Wrapper>
  );
};

export default Menu;
