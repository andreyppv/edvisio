import { routes } from "../../../../routes/School/routes";
import { ReactComponent as Search } from "../../../../assets/svgs/search.svg";
import { ReactComponent as FolderProtected } from "../../../../assets/svgs/folder-protected.svg";
import { ReactComponent as FolderForbidden } from "../../../../assets/svgs/folder-forbidden.svg";
import { ReactComponent as Paper } from "../../../../assets/svgs/paper.svg";
import { ReactComponent as Settings } from "../../../../assets/svgs/settings.svg";
import { ReactComponent as ProtectedPerson } from "../../../../assets/svgs/protected-person.svg";

export const navItems = [
  {
    icon: Search,
    to: routes.SEARCH,
    label: "search applications",
  },
  {
    icon: FolderProtected,
    to: routes.CERTIFY,
    label: "certify applications",
  },
  {
    icon: FolderForbidden,
    to: routes.INCOMPLETE,
    label: "incomplete applications",
  },
  {
    icon: Paper,
    to: routes.REPORTS,
    label: "reports",
  },
  {
    icon: Settings,
    to: routes.SETUP,
    label: "setup",
  },
  {
    icon: ProtectedPerson,
    to: routes.ADMIN,
    label: "admin only",
  },
];
