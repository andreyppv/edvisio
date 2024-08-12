import React, { useState } from "react";
import styled from "styled-components";
import Counter from "../../../../organisms/Counter";
import { Button } from "../../../../atoms/Buttons/Regular";

const Wrapper = styled.div`
  .text {
    padding: 12px 0;
  }
  .counter {
    margin-bottom: 24px;
  }
`;

const ResendCode = () => {
  const [count, setCount] = useState(0);

  return (
    <Wrapper>
      {count ? <Counter count={count} setCount={setCount} /> : ""}
      <Button
        type="button"
        className="text"
        onClick={() => setCount(14)}
        disabled={!!count}
      >
        don’t get a code? resend
      </Button>
    </Wrapper>
  );
};

export default ResendCode;
