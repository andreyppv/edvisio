import styled from "styled-components";

export const Rounded = styled.button`
  width: 36px;
  height: 36px;

  border: 1px solid var(--color-primary-green-1);
  box-sizing: border-box;
  border-radius: 50%;
  background: #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  svg {
    width: 8px;
  }
`;
