export const SCHOOL_BASE_ROUTE = "/school";

export const pageName = {
  LOGIN: "login",
  FORGOT_PASSWORD: "password-recover",
  SEARCH: "search",
  CERTIFY: "certify",
  INCOMPLETE: "incomplete",
  REPORTS: "reports",
  SETUP: "setup",
  MANAGE_ACADEMIC_PERIODS: "manage-academic-periods",
  MANAGE_USERS: "manage-users",
  ADMIN: "admin",
  APPLICATION: "application",
  APPLICATION_HISTORY: "application-history",
  PENDING_CERTIFICATION: "pending-certification",
  INCOMPLETE_APPLICATIONS: "incomplete-applications",
  PENDING_SIGNATURE: "pending-signature",
  PROCESSED_CERTIFICATIONS: "processed-certifications",
  PRE_APPROVAL: "pre-approval",
  ALL_INCLUSIVE: "all-inclusive",
  CREDIT_PULL_AUTHORIZATION: "credit-pull-authorization",
  TUITION_EASE: "tuition-ease",
  TUITION_EXTEND: "tuition-extend",
  TUITION_FLEX: "tuition-flex",
  CERTIFY_APPLICATION: "application-certify",
  VIEW_APPLICATION: "application-view",
};

const {
  LOGIN,
  FORGOT_PASSWORD,
  SEARCH,
  CERTIFY,
  INCOMPLETE,
  REPORTS,
  SETUP,
  ADMIN,
  APPLICATION,
  APPLICATION_HISTORY,
  PENDING_CERTIFICATION,
  INCOMPLETE_APPLICATIONS,
  PENDING_SIGNATURE,
  PROCESSED_CERTIFICATIONS,
  PRE_APPROVAL,
  ALL_INCLUSIVE,
  CREDIT_PULL_AUTHORIZATION,
  TUITION_EASE,
  TUITION_EXTEND,
  TUITION_FLEX,
  MANAGE_ACADEMIC_PERIODS,
  MANAGE_USERS,
  CERTIFY_APPLICATION,
  VIEW_APPLICATION,
} = pageName;

export const routes = {
  LOGIN: `${SCHOOL_BASE_ROUTE}/${LOGIN}`,
  FORGOT_PASSWORD: `${SCHOOL_BASE_ROUTE}/${FORGOT_PASSWORD}`,
  HOME: `${SCHOOL_BASE_ROUTE}`,
  SEARCH: `${SCHOOL_BASE_ROUTE}/${SEARCH}`,
  CERTIFY: `${SCHOOL_BASE_ROUTE}/${CERTIFY}`,
  INCOMPLETE: `${SCHOOL_BASE_ROUTE}/${INCOMPLETE}`,
  REPORTS: `${SCHOOL_BASE_ROUTE}/${REPORTS}`,
  SETUP: `${SCHOOL_BASE_ROUTE}/${SETUP}`,
  MANAGE_ACADEMIC_PERIODS: `${SCHOOL_BASE_ROUTE}/${SETUP}/${MANAGE_ACADEMIC_PERIODS}`,
  MANAGE_USERS: `${SCHOOL_BASE_ROUTE}/${SETUP}/${MANAGE_USERS}`,
  ADMIN: `${SCHOOL_BASE_ROUTE}/${ADMIN}`,
  ADMIN_VIEW_APPLICATION: `${SCHOOL_BASE_ROUTE}/${ADMIN}/${APPLICATION}`,
  APPLICATION_HISTORY: `${SCHOOL_BASE_ROUTE}/${APPLICATION_HISTORY}`,
  VIEW_APPLICATION: `${SCHOOL_BASE_ROUTE}/${VIEW_APPLICATION}`,
  CERTIFY_APPLICATION: `${SCHOOL_BASE_ROUTE}/${CERTIFY}/${CERTIFY_APPLICATION}`,
  REPORT_ALL_INCLUSIVE: `${SCHOOL_BASE_ROUTE}/${REPORTS}/${ALL_INCLUSIVE}`,
  REPORT_PENDING_CERTIFICATION: `${SCHOOL_BASE_ROUTE}/${REPORTS}/${PENDING_CERTIFICATION}`,
  REPORT_INCOMPLETE_APPLICATIONS: `${SCHOOL_BASE_ROUTE}/${REPORTS}/${INCOMPLETE_APPLICATIONS}`,
  REPORT_PENDING_SIGNATURE: `${SCHOOL_BASE_ROUTE}/${REPORTS}/${PENDING_SIGNATURE}`,
  REPORT_PROCESSED_CERTIFICATIONS: `${SCHOOL_BASE_ROUTE}/${REPORTS}/${PROCESSED_CERTIFICATIONS}`,
  REPORT_PRE_APPROVAL: `${SCHOOL_BASE_ROUTE}/${REPORTS}/${PRE_APPROVAL}`,
  CREDIT_PULL_AUTHORIZATION: `${SCHOOL_BASE_ROUTE}/${CREDIT_PULL_AUTHORIZATION}`,
  TUITION_EASE: `${SCHOOL_BASE_ROUTE}/${TUITION_EASE}`,
  TUITION_EXTEND: `${SCHOOL_BASE_ROUTE}/${TUITION_EXTEND}`,
  TUITION_FLEX: `${SCHOOL_BASE_ROUTE}/${TUITION_FLEX}`,
  ADMIN_APPLICATION_HISTORY: `${SCHOOL_BASE_ROUTE}/${ADMIN}/${APPLICATION_HISTORY}`,
};