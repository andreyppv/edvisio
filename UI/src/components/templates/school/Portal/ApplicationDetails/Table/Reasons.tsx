import React from "react";
import styled from "styled-components";

const Ul = styled.div``;

const Reasons = ({ value }: { value: string[] }) => {
  return (
    <Ul>
      {value.map((reason: string) => {
        return <li key={reason}>{reason}</li>;
      })}
    </Ul>
  );
};

export default Reasons;
