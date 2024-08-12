import React from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as Chevron } from "../../../assets/svgs/chevron-left.svg";
import { Rounded as Button } from "../../atoms/Buttons/Action";

const GoBackButton = () => {
  const history = useHistory();

  return (
    <Button type="button" onClick={() => history.goBack()}>
      <Chevron />
    </Button>
  );
};

export default GoBackButton;
