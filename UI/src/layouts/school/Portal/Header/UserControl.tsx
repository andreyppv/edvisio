import React from "react";
import styled from "styled-components";
import { useHistory, Link } from "react-router-dom";
import hand from "../../../../assets/png/hand.png";
import { useUserData } from "../../../../contexts/admin";
import { ReactComponent as LockIcon } from "../../../../assets/svgs/unlocked.svg";
import { ReactComponent as Logout } from "../../../../assets/svgs/logout.svg";
import { routes } from "../../../../routes/School/routes";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  .user-name {
    font-size: 10px;
    font-weight: 700;
    color: var(--color-main-2);
    width: 150px;
    text-align: center;
    display: flex;
    align-items: center;
  }

  button {
    display: flex;
    align-items: center;
  }

  .user-button {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    &,
    & a {
      color: var(--color-gray-2);
      text-decoration: none;
      font-weight: 700;
    }
  }
  .icon {
    &-logout {
      width: 14px;
      height: 14px;
    }

    &-settings {
      width: 16px;
      height: 16px;
    }
  }
`;

const Btn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
`;

const UserControl = () => {
  const { user } = useUserData();

  const LogoutButton = () => {
    const history = useHistory();

    const logoutHandler = () => {
      history.push(routes.LOGIN);
    };
    return (
      <Btn onClick={logoutHandler} className="user-button">
        <Logout className="icon-logout" />
        Log Out
      </Btn>
    );
  };

  const userName =
    user?.data?.firstName && user?.data?.lastName
      ? `${user?.data?.firstName} ${user?.data?.lastName}`
      : "";
  return (
    <Wrapper>
      <div className="user-name">
        {userName ? (
          <>
            <img src={hand} alt="welcome" />
            Welcome, {userName}
          </>
        ) : (
          ""
        )}
      </div>
      <div className="user-button">
        <LockIcon />
        <Link to={routes.FORGOT_PASSWORD}>Reset password</Link>
      </div>
      <LogoutButton />
    </Wrapper>
  );
};

export default UserControl;
