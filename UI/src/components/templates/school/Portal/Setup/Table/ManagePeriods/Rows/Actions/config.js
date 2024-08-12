import { ReactComponent as ViewIcon } from "../../../../../../../../../assets/svgs/view.svg";
import { ReactComponent as EditIcon } from "../../../../../../../../../assets/svgs/pencil.svg";
// import { routes } from "../../../../../../../../../routes/School/routes";

const modalName = {
  EDIT: "EDIT",
};

export const listItems = ({ goTo, openModalHandler }) => [
  {
    icon: ViewIcon,
    label: "View user",
    onClick: () => goTo(""),
  },
  {
    icon: EditIcon,
    label: "Edit Academic Period",
    onClick: () => openModalHandler(modalName.EDIT),
  },
];
