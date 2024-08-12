import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 40px;
  section {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 20px;
    margin-bottom: 20px;

    .color {
      & .value {
        width: 100px;
        height: 40px;
        border-radius: 6px;
      }
    }
  }
`;

const primaryDark = [
  { id: "Primary/Dark/1", label: "Primary/Dark/1", value: "#5A514F" },
  { id: "Primary/Dark/2", label: "Primary/Dark/2", value: "#837572" },
  { id: "Primary/Dark/3", label: "Primary/Dark/3", value: "#A79C9A" },
  { id: "Primary/Dark/4", label: "Primary/Dark/4", value: "#CBC4C3" },
  { id: "Primary/Dark/5", label: "Primary/Dark/5", value: "#EEECEC" },
  { id: "Primary/Dark", label: "Primary/Dark", value: "#1B1C1D" },
];

const PrimaryGreen = [
  { id: "Primary/Green/1", label: "Primary/Green/1", value: "#9ABD55" },
  { id: "Primary/Green/2", label: "Primary/Green/2", value: "#B1CC7B" },
  { id: "Primary/Green/3", label: "Primary/Green/3", value: "#C6DAA0" },
  { id: "Primary/Green/4", label: "Primary/Green/4", value: "#DCE8C4" },
  { id: "Primary/Green/5", label: "Primary/Green/5", value: "#F2F6E9" },
];

const PrimaryBlue = [
  { id: "Primary/Blue/1", label: "Primary/Blue/1", value: "#0C2355" },
  { id: "Primary/Blue/2", label: "Primary/Blue/2", value: "#163F98" },
  { id: "Primary/Blue/3", label: "Primary/Blue/3", value: "#1F5BDB" },
  { id: "Primary/Blue/4", label: "Primary/Blue/4", value: "#5E8AE8" },
  { id: "Primary/Blue/5", label: "Primary/Blue/5", value: "#A1BBF2" },
  { id: "Primary/Blue/6", label: "Primary/Blue/6", value: "#E4EBFB" },
];

const Gray = [
  { id: "Gray/1", label: "Gray/1", value: "#5A5A5E" },
  { id: "Gray/2", label: "Gray/2", value: "#939698" },
  { id: "Gray/3", label: "Gray/3", value: "#D8D8D8" },
  { id: "Gray/4", label: "Gray/4", value: "#F1F1F1" },
];

const Background = [
  { id: "Background/1", label: "Background/1", value: "#F8F9FB" },
  { id: "Background/2", label: "Background/2", value: "#FAFAFA" },
];

const functionalRed = [
  { id: "Functional/Red/1", label: "Functional/Red/1", value: "#BD5555" },
  { id: "Functional/Red/2", label: "Functional/Red/2", value: "#CC7B7B" },
  { id: "Functional/Red/3", label: "Functional/Red/3", value: "#DAA0A0" },
  { id: "Functional/Red/4", label: "Functional/Red/4", value: "#E8C4C4" },
  { id: "Functional/Red/5", label: "Functional/Red/5", value: "#EFD7D7" },
];

const functionalYellow = [
  { id: "Functional/Yellow/1", label: "Functional/Yellow/1", value: "#E6D57B" },
  { id: "Functional/Yellow/2", label: "Functional/Yellow/2", value: "#EADB90" },
  { id: "Functional/Yellow/3", label: "Functional/Yellow/3", value: "#EEE2A5" },
  { id: "Functional/Yellow/4", label: "Functional/Yellow/4", value: "#F2E9BA" },
  { id: "Functional/Yellow/4", label: "Functional/Yellow/4", value: "#F6F0D0" },
];

const functionalBlue = [
  { id: "Functional/Blue/1", label: "Functional/Blue/1", value: "#558BBD" },
  { id: "Functional/Blue/2", label: "Functional/Blue/2", value: "#7BA5CC" },
  { id: "Functional/Blue/3", label: "Functional/Blue/3", value: "#A0BEDA" },
  { id: "Functional/Blue/4", label: "Functional/Blue/4", value: "#C4D7E8" },
  { id: "Functional/Blue/5", label: "Functional/Blue/5", value: "#D7E4EF" },
];

const functionalPurple = [
  { id: "Functional/purple/1", label: "Functional/purple/1", value: "#6455BD" },
  { id: "Functional/purple/2", label: "Functional/purple/2", value: "#877BCC" },
  { id: "Functional/purple/3", label: "Functional/purple/3", value: "#A8A0DA" },
  { id: "Functional/purple/4", label: "Functional/purple/5", value: "#C9C4E8" },
  { id: "Functional/purple/5", label: "Functional/purple/5", value: "#EBE9F6" },
];

const Color = ({ label, value }) => {
  return (
    <div className="color">
      <div className="label">{label}</div>
      <div className="value" style={{ background: value }} />
    </div>
  );
};

const Colors = () => {
  return (
    <Wrapper>
      <section>
        {primaryDark.map((item) => (
          <Color key={item.id} {...item} />
        ))}
      </section>
      <section>
        {PrimaryBlue.map((item) => (
          <Color key={item.id} {...item} />
        ))}
      </section>
      <section>
        {PrimaryGreen.map((item) => (
          <Color key={item.id} {...item} />
        ))}
      </section>
      <section>
        {Gray.map((item) => (
          <Color key={item.id} {...item} />
        ))}
      </section>
      <section>
        {Background.map((item) => (
          <Color key={item.id} {...item} />
        ))}
      </section>
      <section>
        {functionalRed.map((item) => (
          <Color key={item.id} {...item} />
        ))}
      </section>
      <section>
        {functionalYellow.map((item) => (
          <Color key={item.id} {...item} />
        ))}
      </section>
      <section>
        {functionalBlue.map((item) => (
          <Color key={item.id} {...item} />
        ))}
      </section>
      <section>
        {" "}
        {functionalPurple.map((item) => (
          <Color key={item.id} {...item} />
        ))}
      </section>
    </Wrapper>
  );
};

export default Colors;
