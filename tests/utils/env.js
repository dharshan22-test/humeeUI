function normalizeEnvValue(value) {
  return String(value || "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\/+$/, "");
}

function requireEnv(name) {
  const value = normalizeEnvValue(process.env[name]);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const API_BASE_URL = requireEnv("API_BASE_URL");
const APPLICATION_URL = requireEnv("APPLICATION_URL");
const WEBSITE_URL = requireEnv("WEBSITE_URL");
const DIRECT_LOGIN_COUNTRY_CODE =
  normalizeEnvValue(process.env.DIRECT_LOGIN_COUNTRY_CODE) || "+1";
const DIRECT_LOGIN_MOBILE =
  normalizeEnvValue(process.env.DIRECT_LOGIN_MOBILE) || "8622595064";

const DASHBOARD_ORIGIN = new URL(APPLICATION_URL).origin;
const WEBSITE_HOST = new URL(WEBSITE_URL).host;

module.exports = {
  API_BASE_URL,
  APPLICATION_URL,
  WEBSITE_URL,
  DIRECT_LOGIN_COUNTRY_CODE,
  DIRECT_LOGIN_MOBILE,
  DASHBOARD_ORIGIN,
  WEBSITE_HOST,
};
