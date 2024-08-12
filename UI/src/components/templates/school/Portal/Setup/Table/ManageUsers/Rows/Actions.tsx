import React from "react";
import { useDropDownMenu } from "../../../../../../../organisms/Menu/TableDropdown/menu-hook";
import { listItems } from "./config";
import DropDown from "../../../../../../../organisms/Menu/TableDropdown";
import Modal from "../../../../../../../organisms/Modal/Regular";
import EditForm from "../Form";

const Actions = ({ screenTrackingId, formData, cb }: any) => {
  const {
    openModalHandler,
    modalType,
    closeModalHandler,
    goTo,
    enableUser,
    disableUser,
  } = useDropDownMenu();

  const list = listItems({
    goTo,
    enableUser,
    screenTrackingId,
    disableUser,
    openModalHandler,
  });

  return (
    <>
      <DropDown listItems={list} />
      <Modal
        open={!!modalType}
        modalContent={
          <EditForm
            closeModal={closeModalHandler}
            formData={formData}
            cb={cb}
          />
        }
        handleClose={closeModalHandler}
      />
    </>
  );
};

export default Actions;
