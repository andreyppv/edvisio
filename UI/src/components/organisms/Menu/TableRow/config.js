import React from "react";
import { ReactComponent as Error } from "../../../../assets/svgs/error.svg";
import { ReactComponent as Pencil } from "../../../../assets/svgs/pencil.svg";
import { ReactComponent as Bin } from "../../../../assets/svgs/bin.svg";
import { ReactComponent as Refresh } from "../../../../assets/svgs/refresh.svg";
import { ReactComponent as Add } from "../../../../assets/svgs/add.svg";
import { ReactComponent as View } from "../../../../assets/svgs/view.svg";

const buttonName = {
  VIEW: "view",
  EDIT: "edit",
  ADD: "add",
  DELETE: "delete",
  DISABLE: "disable",
  ACTIVE: "active",
};

export const menuButtons = [
  {
    label: buttonName.VIEW,
    name: buttonName.VIEW,
    icon: <View width="16px" />,
  },
  {
    label: buttonName.EDIT,
    name: buttonName.EDIT,
    icon: <Pencil width="13px" />,
  },
  { label: buttonName.ADD, name: buttonName.ADD, icon: <Add width="15px" /> },
  {
    label: buttonName.DELETE,
    name: buttonName.DELETE,
    icon: <Bin width="18px" />,
  },
  {
    label: buttonName.DISABLE,
    name: buttonName.DISABLE,
    icon: <Error width="15px" />,
  },
  {
    label: buttonName.ACTIVE,
    name: buttonName.ACTIVE,
    icon: <Refresh width="12px" />,
  },
];
