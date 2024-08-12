import React from "react";
import ActionButton from "../../../molecules/Buttons/ActionButtons";
import Td from "./styles";

const Menu = ({ onToggle, active, onClick, buttons = [] }: any) => {
  return (
    <Td className={`${active ? "expanded" : ""} menu-wrapper`}>
      <div className="cell">
        <ActionButton type="expand" onClick={onToggle} />
      </div>
      {active ? (
        <div className="menu">
          {buttons.map((button: any) => {
            return (
              <button type="button" key={button.name} onClick={onClick}>
                {button.icon}
                <div className="label">{button.label}</div>
              </button>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </Td>
  );
};

export default Menu;
