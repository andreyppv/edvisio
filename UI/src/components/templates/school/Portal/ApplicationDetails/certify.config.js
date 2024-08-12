import TextField from "../../../../molecules/Controllers/TextField";
import FormattedField from "../../../../molecules/Controllers/FormattedField";
import DatePicker from "../../../../molecules/Controllers/DatePicker";
import Select from "../../../../molecules/Controllers/Select";
import { terms as termsOptions } from "../../../../../utils/selectsOptions";

export const groupTableData = (data) => {
  return {
    borrowerInfo: {
      borrowerName: data?.borrowerName || "",
      borrowerPhoneNumber: data?.borrowerPhoneNumber || "",
      borrowerEmail: data?.borrowerEmail || "",
      studentId: data?.studentId || "",
    },
    coSignerInfo: {
      coSignerName: data?.coSignerName || "",
      coSignerSSN: data?.coSignerSSN || "",
      coSignerEmail: data?.coSignerEmail || "",
    },
    applicationInfo: {
      creditDecision: data?.creditDecision || "",
      borrowerCreditScore: data?.borrowerCreditScore || "",
      coSignerCreditScore: data?.coSignerCreditScore || "",
      graduationDate: data?.graduationDate || "",
      program: data?.program || "",
      startDate: data?.startDate || "",
      endDate: data?.endDate || "",
      cost: data?.cost || "",
      financialAssistance: data?.financialAssistance || "",
      tuitionAmount: data?.tuitionAmount || "",
      loanTerm: data?.loanTerm || "",
      releaseToServicingDate: data?.releaseToServicingDate || "",
    },
    certificationInfo: {
      program: data?.program || "",
      startDate: data?.startDate || "",
      endDate: data?.endDate || "",
      cost: data?.cost || "",
      financialAssistance: data?.financialAssistance || "",
      repaymentTerm: data?.repaymentTerm || "",
      tuitionAmount: data?.tuitionAmount || "",
      inSchoolAmount: data?.inSchoolAmount || "",
      afterSchoolAmount: data?.afterSchoolAmount || "",
      interestRate: data?.interestRate || "",
    },
  };
};

export const borrowerInformation = (data) => {
  return {
    labels: {
      heading: "Borrower Information:",
      subheadings: [
        "Borrower Name:",
        "Borrower SSN:",
        "Borrower Email:",
        "Student ID",
      ],
    },
    form: [
      {
        name: "borrowerName",
        value: data?.borrowerName || "",
        component: TextField,
        isEditable: false,
      },
      {
        name: "borrowerPhoneNumber",
        value: data?.borrowerPhoneNumber || "",
        component: FormattedField,
        mask: "_",
        format: "+1 (###) ### ## ####",
        isEditable: false,
      },
      {
        name: "borrowerEmail",
        value: data?.borrowerEmail || "",
        component: TextField,
        isEditable: false,
      },
      {
        name: "studentId",
        value: data?.studentId || "",
        component: FormattedField,
        format: "############",
        isEditable: true,
      },
    ],
  };
};

export const coSignerInformation = (data) => {
  return {
    labels: {
      heading: "Cosigner Information:",
      subheadings: ["Cosigner Name:", "Cosigner SSN:", "Cosigner Email:"],
    },
    form: [
      {
        name: "coSignerName",
        value: data?.coSignerName || "",
        component: TextField,
        isEditable: false,
      },
      {
        name: "coSignerSSN",
        value: data?.coSignerSSN || "",
        component: FormattedField,
        isEditable: false,
        mask: "_",
        format: "###-##-####",
      },
      {
        name: "coSignerEmail",
        value: data?.coSignerEmail || "",
        component: TextField,
        isEditable: false,
      },
    ],
  };
};

export const applicationInformation = (data) => {
  return {
    labels: {
      heading: "Application Information:",
      subheadings: [
        "Borrower Credit Decision:",
        "Borrower Credit Score:",
        "Cosigner Credit Score:",
        "Anticipated Graduation Date:",
        "Academic Program:",
        "Academic Program Period Start Date:",
        "Academic Program Period End Date:",
        "Cost of Attendance:",
        "Financial Assistance:",
        "Tuition Amount Certified:",
        "Loan Term",
        "Release to Servicing Date:",
      ],
    },
    form: [
      {
        value: data?.creditDecision || "",
        name: "creditDecision",
        component: TextField,
        isEditable: false,
      },
      {
        value: data?.borrowerCreditScore || "",
        name: "borrowerCreditScore",
        component: TextField,
        isEditable: false,
      },
      {
        value: data?.coSignerCreditScore || "",
        name: "coSignerCreditScore",
        component: TextField,
        isEditable: false,
      },
      {
        value: data?.graduationDate || "",
        name: "graduationDate",
        component: DatePicker,
        isEditable: true,
      },
      {
        value: data?.program || "",
        name: "program",
        component: Select,
        options: termsOptions,
        isEditable: true,
      },
      {
        value: data?.startDate || "",
        name: "startDate",
        component: DatePicker,
        isEditable: true,
      },
      {
        value: data?.endDate || "",
        name: "endDate",
        component: DatePicker,
        isEditable: true,
      },
      {
        value: data?.cost || "",
        name: "cost",
        component: FormattedField,
        thousandSeparator: true,
        prefix: "$",
        isEditable: true,
      },
      {
        value: data?.financialAssistance || "",
        name: "financialAssistance",
        component: FormattedField,
        thousandSeparator: true,
        prefix: "$",
        isEditable: true,
      },
      {
        value: data?.tuitionAmount || "",
        name: "tuitionAmount",
        component: FormattedField,
        thousandSeparator: true,
        prefix: "$",
        isEditable: true,
      },
      {
        value: data?.loanTerm || "",
        name: "loanTerm",
        component: Select,
        options: termsOptions,
        isEditable: true,
      },
      {
        value: data?.releaseToServicingDate || "",
        name: "releaseToServicingDate",
        component: DatePicker,
        isEditable: true,
      },
    ],
  };
};

export const certificationInformation = (data) => {
  return {
    labels: {
      heading: "Certification Information:",
      subheadings: [
        "Academic Program:",
        "Academic Program Period Start Date:",
        "Academic Program Period End Date:",
        "Cost of Attendance:",
        "Financial Assistance:",
        "Tuition Amount Certified:",
        "Repayment Term:",
        "In School/Graduated Payment amount:",
        "Out of School/Full P&I Payment amount:",
        "Interest Rate:",
      ],
    },
    form: [
      {
        value: data?.program || "--",
        name: "program",
        component: Select,
        options: termsOptions,
        isEditable: false,
      },
      {
        value: data?.startDate || "--",
        name: "startDate",
        component: DatePicker,
        isEditable: false,
      },
      {
        value: data?.endDate || "--",
        name: "endDate",
        component: DatePicker,
        isEditable: false,
      },
      {
        value: data?.cost || "--",
        name: "cost",
        component: FormattedField,
        thousandSeparator: true,
        prefix: "$",
        isEditable: false,
      },
      {
        value: data?.financialAssistance || "--",
        name: "financialAssistance",
        component: FormattedField,
        thousandSeparator: true,
        prefix: "$",
        isEditable: false,
      },
      {
        value: data?.tuitionAmount || "--",
        name: "tuitionAmount",
        component: FormattedField,
        thousandSeparator: true,
        prefix: "$",
        isEditable: false,
      },
      {
        value: data?.repaymentTerm || "--",
        name: "repaymentTerm",
        component: Select,
        options: termsOptions,
        isEditable: false,
      },
      {
        value: data?.inSchoolAmount || "--",
        name: "inSchoolAmount",
        component: FormattedField,
        thousandSeparator: true,
        prefix: "$",
        isEditable: false,
      },
      {
        value: data?.afterSchoolAmount || "--",
        name: "afterSchoolAmount",
        component: FormattedField,
        thousandSeparator: true,
        prefix: "$",
        isEditable: false,
      },
      {
        value: data?.interestRate || "--",
        name: "interestRate",
        component: TextField,
        isEditable: false,
      },
    ],
  };
};
