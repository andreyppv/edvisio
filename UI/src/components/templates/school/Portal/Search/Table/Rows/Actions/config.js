import { ReactComponent as ViewIcon } from "../../../../../../../../assets/svgs/view.svg";
import { ReactComponent as CheckedIcon } from "../../../../../../../../assets/svgs/checked.svg";
import { ReactComponent as RefreshIcon } from "../../../../../../../../assets/svgs/refresh.svg";
import { ReactComponent as PrinterIcon } from "../../../../../../../../assets/svgs/printer.svg";
import { ReactComponent as ErrorIcon } from "../../../../../../../../assets/svgs/error.svg";
import { routes } from "../../../../../../../../routes/School/routes";

export const modalName = {
  WITHDRAW: "WITHDRAW",
};

export const listItems = ({
  goTo,
  print,
  screenTrackingId,
  openModalHandler,
}) => [
  {
    icon: ViewIcon,
    label: "View application",
    onClick: () => goTo(`${routes.VIEW_APPLICATION}/${screenTrackingId}`),
  },
  {
    icon: CheckedIcon,
    label: "Certify Application",
    onClick: () => goTo(`${routes.CERTIFY_APPLICATION}/${screenTrackingId}`),
  },
  {
    icon: RefreshIcon,
    label: "Application History",
    onClick: () => goTo(`${routes.APPLICATION_HISTORY}/${screenTrackingId}`),
  },
  {
    icon: PrinterIcon,
    label: "Print Application",
    onClick: (e) => print(e),
  },
  {
    icon: ErrorIcon,
    label: "Withdraw Application",
    onClick: () => openModalHandler(modalName.WITHDRAW),
  },
];
