import React from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";

// THIS IS A REUSABLE MODAL COMPONENT:
// YOU NEED TO CONNECT IT TO THE COMPONENT THAT IS TO TRIGGER IS
// YOU CAN GO THE STORYBOOK TO SEE HOW IT IS USED

const StyledDialog = styled(Dialog)`
  .MuiDialog-container .MuiDialog-paperWidthSm {
    max-width: 100%;
    min-height: 300px;
    margin-top: 10%;

    @media screen and (max-width: 500px) {
      margin-top: 0;
      height: 90vh;
    }
  }
  .MuiDialog-scrollPaper {
    align-items: start;
  }

  @media screen and (max-width: 600px) {
    .MuiDialog-container {
      & .MuiDialog-paperWidthSm {
        border-radius: 0;
      }
      & .MuiDialog-paperScrollPaper {
        max-height: unset;
      }
    }

    .MuiDialog-paper {
      margin: 0;
    }
  }
`;

type IModalDialog = {
  open: boolean;
  modalContent: any;
  handleClose: any;
};

const ModalDialog = ({ modalContent, open, handleClose }: IModalDialog) => {
  return (
    <StyledDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      {modalContent}
    </StyledDialog>
  );
};

export default ModalDialog;
