import { useState } from "react";
import { useHistory } from "react-router-dom";

export const useDropDownMenu = () => {
  const [modalType, setModalType] = useState("");
  const history = useHistory();

  const openModalHandler = (type) => {
    setModalType(type);
  };

  const closeModalHandler = () => {
    setModalType("");
  };

  const goTo = (link) => {
    if (link) {
      history.push(link);
    }
  };

  const enableUser = () => {
    //
  };

  const disableUser = () => {
    //
  };

  const onPrintHandler = () => {
    //
  };

  return {
    onPrintHandler,
    closeModalHandler,
    goTo,
    modalType,
    enableUser,
    disableUser,
    openModalHandler,
  };
};
