import styled, { css } from "styled-components";

const common = css`
  font-family: "Montserrat";
  color: var(--color-primary-dark-1);
`;

export const H1 = styled.h1`
  ${common};
  font-size: 56px;
  font-weight: 700;
  line-height: 68px;
`;

export const H2 = styled.h2`
  ${common};
  font-size: 44px;
  font-weight: 700;
  line-height: 53px;
`;

export const H3 = styled.h3`
  ${common};
  font-size: 36px;
  font-weight: 600;
  line-height: 43px;
`;

export const H4 = styled.h4`
  ${common};
  font-size: 30px;
  font-weight: 600;
  line-height: 36px;
`;

export const H5 = styled.h5`
  ${common};
  font-size: 24px;
  font-weight: 600;
  line-height: 29px;
`;

export const Subtitle = styled.p`
  ${common};
  font-size: 18px;
  font-weight: 600;
  line-height: 21px;
`;

export const Text = styled.p`
  ${common};
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
`;

export const Caption = styled.p`
  ${common};
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
`;

export const TextSm = styled.p`
  ${common};
  font-size: 10px;
  font-weight: 400;
  line-height: 12px;
`;
