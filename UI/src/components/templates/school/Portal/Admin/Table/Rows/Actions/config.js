import { ReactComponent as ViewIcon } from "../../../../../../../../assets/svgs/view.svg";
import { ReactComponent as CheckedIcon } from "../../../../../../../../assets/svgs/checked.svg";
import { ReactComponent as RefreshIcon } from "../../../../../../../../assets/svgs/refresh.svg";
import { ReactComponent as PrinterIcon } from "../../../../../../../../assets/svgs/printer.svg";
import { ReactComponent as ErrorIcon } from "../../../../../../../../assets/svgs/error.svg";
import { ReactComponent as EditIcon } from "../../../../../../../../assets/svgs/pencil.svg";
import { routes } from "../../../../../../../../routes/School/routes";

const modalName = {
  DUE_DATE: "DUE_DATE",
  CREDIT_DECISION_CONFIRM: "CREDIT_DECISION_CONFIRM",
};

export const listItems = ({
  goTo,
  openModalHandler,
  print,
  screenTrackingId,
}) => [
  {
    icon: ViewIcon,
    label: "View application",
    onClick: () => goTo(`${routes.ADMIN_VIEW_APPLICATION}/${screenTrackingId}`),
  },
  {
    icon: RefreshIcon,
    label: "Application History",
    onClick: () =>
      goTo(`${routes.ADMIN_APPLICATION_HISTORY}/${screenTrackingId}`),
  },
  {
    icon: PrinterIcon,
    label: "Print Application",
    onClick: (e) => print(e),
  },
  {
    icon: EditIcon,
    label: "Change Status",
    onClick: (e) => print(e),
  },
  {
    icon: EditIcon,
    label: "Change RTS Date",
    onClick: (e) => print(e),
  },
  {
    icon: EditIcon,
    label: "Change First Pay Due Date",
    onClick: () => openModalHandler(modalName.DUE_DATE),
  },
  {
    icon: CheckedIcon,
    label: "Approve Research Review",
    onClick: () => openModalHandler(),
  },
  {
    icon: ErrorIcon,
    label: "Deny Research Review",
    onClick: () => openModalHandler(),
  },
  {
    icon: ViewIcon,
    label: "Review Credit Decision",
    onClick: () => openModalHandler(),
  },
  {
    icon: CheckedIcon,
    label: "Confirm Credit Decision",
    onClick: () => openModalHandler(modalName.CREDIT_DECISION_CONFIRM),
  },
];
