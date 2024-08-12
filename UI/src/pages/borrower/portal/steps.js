import SelectSchool from "./Select-school";
import ESignConsent from "./Consent";
import CommunicationConsent from "./Communication";
import CreditAuthorization from "./CreditAuthorization";
import SolicitationDisclosure from "./SolicitationDisclosure";

export const steps = () => [
  {
    active: true,
    completed: false,
    label: "select school and program terms",
    number: 1,
    component: SelectSchool,
  },
  {
    active: false,
    completed: false,
    label: "e-sign disclosure and consent",
    number: 2,
    component: ESignConsent,
  },
  {
    active: false,
    completed: false,
    label: "communication consent",
    number: 3,
    component: CommunicationConsent,
  },
  {
    active: false,
    completed: false,
    label: "credit authorization",
    number: 4,
    component: CreditAuthorization,
  },
  {
    active: false,
    completed: false,
    label: "Solicitation Disclosure",
    number: 5,
    component: SolicitationDisclosure,
  },
];
