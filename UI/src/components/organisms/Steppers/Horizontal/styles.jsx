import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 40px;
  position: relative;
  border-left: 4px solid var(--color-gray-3);
  padding-left: 16px;
  padding-top: 3px;
  font-size: 10px;
  text-transform: upperCase;
  color: var(--color-gray-3);
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  line-height: 1;

  &.lastStep {
    border-color: transparent;
  }

  &:before {
    content: "";
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: -2px;
    transform: translateX(-50%);
    background: #fff;
    border: 4px solid var(--color-gray-3);
  }

  &.completed {
    color: var(--color-primary-green-1);
    &:before {
      border-color: var(--color-primary-green-1);
      background: var(--color-primary-green-1);
    }
    border-left-color: var(--color-primary-green-1);
  }

  &.active {
    color: var(--color-primary-green-1);
    &:before {
      border-color: var(--color-primary-green-1);
      background: #fff;
    }
  }

  .edit-button {
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    & svg {
      width: 14px;
      height: 14px;
      & path {
        fill: var(--color-primary-green-1);
      }
    }
  }
`;

export default Wrapper;
