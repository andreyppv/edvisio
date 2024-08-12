import React from "react";
import styled from "styled-components";
import add from "../../assets/svgs/add.svg";
import alert from "../../assets/svgs/alert.svg";
import bank from "../../assets/svgs/bank.svg";
import bell from "../../assets/svgs/bell.svg";
import bin from "../../assets/svgs/bin.svg";
import bookmark from "../../assets/svgs/bookmark.svg";
import burgerMenu from "../../assets/svgs/burger-menu.svg";
import calendar from "../../assets/svgs/calendar.svg";
import camera from "../../assets/svgs/camera.svg";
import caseIcon from "../../assets/svgs/case.svg";
import checked from "../../assets/svgs/checked.svg";
import chevronDown from "../../assets/svgs/chevron-down.svg";
import chevronLeft from "../../assets/svgs/chevron-left.svg";
import chevronRight from "../../assets/svgs/chevron-right.svg";
import chevronUp from "../../assets/svgs/chevron-up.svg";
import clock from "../../assets/svgs/clock.svg";
import connect from "../../assets/svgs/connect.svg";
import cross from "../../assets/svgs/cross.svg";
import danger from "../../assets/svgs/danger.svg";
import dollar from "../../assets/svgs/dollar.svg";
import download from "../../assets/svgs/download.svg";
import envelope from "../../assets/svgs/envelope.svg";
import error from "../../assets/svgs/error.svg";
import expand from "../../assets/svgs/expand.svg";
import facebook from "../../assets/svgs/facebook.svg";
import filter from "../../assets/svgs/filter.svg";
import folderAdd from "../../assets/svgs/folder-add.svg";
import folderDownload from "../../assets/svgs/folder-download.svg";
import folderForbidden from "../../assets/svgs/folder-forbidden.svg";
import folderMoveLeft from "../../assets/svgs/folder-move-left.svg";
import folderMoveRight from "../../assets/svgs/folder-move-right.svg";
import folderProtected from "../../assets/svgs/folder-protected.svg";
import folder from "../../assets/svgs/folder.svg";
import headset from "../../assets/svgs/headset.svg";
import homeSmile from "../../assets/svgs/home-smile.svg";
import home from "../../assets/svgs/home.svg";
import info from "../../assets/svgs/info.svg";
import instagram from "../../assets/svgs/instagram.svg";
import linkedin from "../../assets/svgs/linkedin.svg";
import list from "../../assets/svgs/list.svg";
import location from "../../assets/svgs/location.svg";
import locked from "../../assets/svgs/locked.svg";
import login from "../../assets/svgs/login.svg";
import logout from "../../assets/svgs/logout.svg";
import mobile from "../../assets/svgs/mobile.svg";
import paper from "../../assets/svgs/paper.svg";
import pencil from "../../assets/svgs/pencil.svg";
import personCopy from "../../assets/svgs/person-copy.svg";
import personMove from "../../assets/svgs/person-move.svg";
import person from "../../assets/svgs/person.svg";
import phone from "../../assets/svgs/phone.svg";
import picture from "../../assets/svgs/picture.svg";
import printerMess from "../../assets/svgs/printer-mess.svg";
import printer from "../../assets/svgs/printer.svg";
import protectedPerson from "../../assets/svgs/protected-person.svg";
import protectedIcon from "../../assets/svgs/protected.svg";
import question from "../../assets/svgs/question.svg";
import refresh from "../../assets/svgs/refresh.svg";
import remove from "../../assets/svgs/remove.svg";
import send from "../../assets/svgs/send.svg";
import search from "../../assets/svgs/search.svg";
import settings from "../../assets/svgs/settings.svg";
import share from "../../assets/svgs/share.svg";
import sort from "../../assets/svgs/sort.svg";
import stack from "../../assets/svgs/stack.svg";
import staple from "../../assets/svgs/staple.svg";
import star from "../../assets/svgs/star.svg";
import success from "../../assets/svgs/success.svg";
import talk from "../../assets/svgs/talk.svg";
import twitter from "../../assets/svgs/twitter.svg";
import unlocked from "../../assets/svgs/unlocked.svg";
import upload from "../../assets/svgs/upload.svg";
import view from "../../assets/svgs/view.svg";
import wallet from "../../assets/svgs/wallet.svg";
import windLeft from "../../assets/svgs/wind-left.svg";
import windRight from "../../assets/svgs/wind-right.svg";

const Wrapper = styled.div`
  padding: 40px;
  section {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 20px;
    margin-bottom: 20px;

    .color {
      & .value {
        width: 100px;
        height: 40px;
        border-radius: 6px;
      }
    }
  }
`;

const renderIcons = [
  { label: "add", value: add },
  { label: "alert", value: alert },
  { label: "bank", value: bank },
  { label: "bell", value: bell },
  { label: "bin", value: bin },
  { label: "bookmark", value: bookmark },
  { label: "burger-menu", value: burgerMenu },
  { label: "calendar", value: calendar },
  { label: "camera", value: camera },
  { label: "case", value: caseIcon },
  { label: "checked", value: checked },
  { label: "chevron-down", value: chevronDown },
  { label: "chevron-left", value: chevronLeft },
  { label: "chevron-right", value: chevronRight },
  { label: "chevron-up", value: chevronUp },
  { label: "clock", value: clock },
  { label: "connect", value: connect },
  { label: "cross", value: cross },
  { label: "danger", value: danger },
  { label: "dollar", value: dollar },
  { label: "download", value: download },
  { label: "envelope", value: envelope },
  { label: "error", value: error },
  { label: "expand", value: expand },
  { label: "facebook", value: facebook },
  { label: "filter", value: filter },
  { label: "folder-ddd", value: folderAdd },
  { label: "folder-download", value: folderDownload },
  { label: "folder-forbidden", value: folderForbidden },
  { label: "folder-move-left", value: folderMoveLeft },
  { label: "folder-move-right", value: folderMoveRight },
  { label: "folder-protected", value: folderProtected },
  { label: "folder", value: folder },
  { label: "headset", value: headset },
  { label: "home-smile", value: homeSmile },
  { label: "home", value: home },
  { label: "info", value: info },
  { label: "instagram", value: instagram },
  { label: "linkedin", value: linkedin },
  { label: "list", value: list },
  { label: "location", value: location },
  { label: "locked", value: locked },
  { label: "login", value: login },
  { label: "logout", value: logout },
  { label: "mobile", value: mobile },
  { label: "paper", value: paper },
  { label: "pencil", value: pencil },
  { label: "person-copy", value: personCopy },
  { label: "person-move", value: personMove },
  { label: "person", value: person },
  { label: "phone", value: phone },
  { label: "picture", value: picture },
  { label: "printer-mess", value: printerMess },
  { label: "printer", value: printer },
  { label: "protected-person", value: protectedPerson },
  { label: "protected", value: protectedIcon },
  { label: "question", value: question },
  { label: "refresh", value: refresh },
  { label: "remove", value: remove },
  { label: "send", value: send },
  { label: "search", value: search },
  { label: "settings", value: settings },
  { label: "share", value: share },
  { label: "sort", value: sort },
  { label: "stack", value: stack },
  { label: "staple", value: staple },
  { label: "star", value: star },
  { label: "success", value: success },
  { label: "talk", value: talk },
  { label: "twitter", value: twitter },
  { label: "unlocked", value: unlocked },
  { label: "upload", value: upload },
  { label: "view", value: view },
  { label: "wallet", value: wallet },
  { label: "wind-left", value: windLeft },
  { label: "wind-right", value: windRight },
];

const Icon = ({ label, value }) => {
  return (
    <div className="color">
      <div className="label">{label}</div>
      <img src={value} alt={label} />
    </div>
  );
};

const Colors = () => {
  return (
    <Wrapper>
      <section>
        {renderIcons.map((item) => (
          <Icon key={item.label} {...item} />
        ))}
      </section>
    </Wrapper>
  );
};

export default Colors;
