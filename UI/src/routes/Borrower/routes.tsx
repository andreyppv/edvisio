export const BORROWER_BASE_ROUTE = "/borrower";

export const pageName = {
  LOGIN: "login",
  FORGOT_PASSWORD: "password-recover",
  VERIFICATION: "verification",
};

const { LOGIN, FORGOT_PASSWORD, VERIFICATION } = pageName;

export const routes = {
  PORTAL: `${BORROWER_BASE_ROUTE}/`,
  LOGIN: `${BORROWER_BASE_ROUTE}/${LOGIN}`,
  FORGOT_PASSWORD: `${BORROWER_BASE_ROUTE}/${FORGOT_PASSWORD}`,
  VERIFICATION: `${BORROWER_BASE_ROUTE}/${VERIFICATION}`,
};
