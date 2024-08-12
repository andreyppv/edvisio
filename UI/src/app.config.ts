let baseUrl = "https://tguc.alchemylms.com";
const environment = process.env.NODE_ENV;

if (environment && environment !== "development") {
  baseUrl = "https://tguc.alchemylms.com";
}

const url = baseUrl;
export default url;
