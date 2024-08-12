import React from "react";
import MenuWrapper from "./styles";

interface IDropMenu {
  handleClose: any;
  listItems: any[];
}

const MenuList = ({ handleClose, listItems = [] }: IDropMenu) => {
  return (
    <MenuWrapper>
      {listItems.map(({ icon: Icon, label, onClick }: any) => {
        return (
          <li key={label}>
            <div className="icon-wrapper">
              <Icon />
            </div>
            <button
              type="button"
              onClick={(e) => {
                onClick(e);
                handleClose(e);
              }}
            >
              {label}
            </button>
          </li>
        );
      })}
    </MenuWrapper>
  );
};

export default MenuList;
