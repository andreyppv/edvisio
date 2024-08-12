import { ReactComponent as ViewIcon } from "../../../../../../../../assets/svgs/view.svg";
import { ReactComponent as CheckedIcon } from "../../../../../../../../assets/svgs/checked.svg";
import { ReactComponent as ErrorIcon } from "../../../../../../../../assets/svgs/error.svg";
import { ReactComponent as EditIcon } from "../../../../../../../../assets/svgs/pencil.svg";
import { routes } from "../../../../../../../../routes/School/routes";

const modalName = {
  EDIT: "EDIT",
};

export const listItems = ({
  goTo,
  enableUser,
  disableUser,
  openModalHandler,
  screenTrackingId,
}) => [
  {
    icon: ViewIcon,
    label: "View user",
    onClick: () => goTo(`${routes.ADMIN_VIEW_APPLICATION}/${screenTrackingId}`),
  },
  {
    icon: EditIcon,
    label: "Edit User",
    onClick: () => openModalHandler(modalName.EDIT),
  },
  {
    icon: CheckedIcon,
    label: "Enable User",
    onClick: () => enableUser(screenTrackingId),
  },
  {
    icon: ErrorIcon,
    label: "Disable User",
    onClick: () => disableUser(screenTrackingId),
  },
];
