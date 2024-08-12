import React from "react";
import { useDropDownMenu } from "../../../../../../../organisms/Menu/TableDropdown/menu-hook";
import { listItems } from "./config";
import DropDown from "../../../../../../../organisms/Menu/TableDropdown";
import Modal from "../../../../../../../organisms/Modal/Regular";
import WithdrawForm from "../../../../Withdraw";

const Actions = ({ screenTrackingId }: any) => {
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
        modalContent={<WithdrawForm closeModal={closeModalHandler} />}
        handleClose={closeModalHandler}
      />
    </>
  );
};

export default Actions;
