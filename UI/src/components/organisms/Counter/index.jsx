/*eslint-disable*/
import React, { useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  color: var(--color-gray-2);
  font-weight: 700;
  font-size: 14px;
`;

const parseCount = (count) => {
  if (count >= 60) {
    const minutes = Math.round(count / 60);
    let seconds = Math.round(count - minutes * 60);
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `0${minutes}:${seconds}`;
  }
  if (count < 60 && count >= 10) {
    return `00:${count}`;
  }
  if (count < 10) {
    return `00:0${count}`;
  }
  return count;
};

const Counter = ({ count, setCount }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevState) => prevState - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Wrapper className="counter">Resend in {parseCount(count)} seconds</Wrapper>
  );
};

export default Counter;
