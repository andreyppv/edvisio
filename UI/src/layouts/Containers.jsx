import styled, { css } from "styled-components";

const container = css`
  width: 100%;
  margin: 0 auto;
  padding: 0 15px;
`;

export const ContainerLg = styled.div`
  max-width: var(--container-large-width);
  ${container}
`;

export const ContainerMd = styled.div`
  max-width: var(--container-medium-width);
  ${container}
`;

export const ContainerSm = styled.div`
  max-width: var(--container-sm-width);
  width: 100%;
`;

export const ContainerSmx = styled.div`
  max-width: var(--container-sm-width);
  width: 100%;
`;
