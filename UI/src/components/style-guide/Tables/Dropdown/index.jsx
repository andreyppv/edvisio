import React from "react";
import { useDropDownMenu } from "../../../organisms/Menu/TableDropdown/menu-hook";
import { listItems } from "./config";
import DropDown from "../../../organisms/Menu/TableDropdown";
import Modal from "../../../organisms/Modal/Regular";
import { Button } from "../../../atoms/Buttons/Regular";

const ModalContent = ({ closeModal }) => {
  return (
    <Button type="button" onClick={closeModal}>
      Close modal
    </Button>
  );
};

const Actions = ({ screenTrackingId }) => {
  const {
    openModalHandler,
    modalType,
    closeModalHandler,
    goTo,
    onPrintHandler,
  } = useDropDownMenu();

  const list = listItems({
    goTo,
    print: onPrintHandler,
    screenTrackingId,
    openModalHandler,
  });

  return (
    <>
      <DropDown listItems={list} />
      <Modal
        open={!!modalType}
        modalContent={<ModalContent closeModal={closeModalHandler} />}
        handleClose={closeModalHandler}
      />
    </>
  );
};

export default Actions;
