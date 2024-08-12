import React from "react";
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  Subtitle,
  Text,
  Caption,
  TextSm,
} from "../atoms/Typography";

const Guide = () => {
  return (
    <section>
      <H1>H1 / 56 px</H1>
      <H2>H2 / 44 px</H2>
      <H3>H3 / 36 px</H3>
      <H4>H4 / 30 px</H4>
      <H5>H5 / 24 px</H5>
      <Subtitle>Subtitle / 18 px</Subtitle>
      <Text>Text / 14 px</Text>
      <Caption>Caption / caps / 12 px</Caption>
      <TextSm>TextSm / 12 px</TextSm>
    </section>
  );
};

export default Guide;
