const { expect, request } = require("@playwright/test");
const CryptoJS = require("crypto-js");

async function authentication(page, phoneNumber) {
  // ================= CONFIG =================
  const API_BASE_URL = "https://apistaging.humee.io";
  const DASHBOARD_URL = "https://dashboardstaging.humee.io/";
  const SECRET_KEY = "xfnr3PVyckouBZxW";

  // ================= LOGIN PAYLOAD =================
  const payload = {
    countryCode: "+1",
    mobile: phoneNumber,
  };

  // ================= ENCRYPT REQUEST =================
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(SECRET_KEY);

  const encryptedPayload = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(JSON.stringify(payload)),
    key,
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();

  // ================= API CONTEXT =================
  const apiContext = await request.newContext({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
  });

  // ================= LOGIN API =================
  const response = await apiContext.post("/api/users/login", {
    data: { key: encryptedPayload },
  });

  expect(response.ok()).toBeTruthy();

  const responseBody = await response.json();
  expect(responseBody.key).toBeTruthy();

  // ================= BASE64URL → BASE64 =================
  let encryptedResponse = responseBody.key
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  while (encryptedResponse.length % 4 !== 0) {
    encryptedResponse += "=";
  }

  // ================= DECRYPT RESPONSE =================
  const decrypted = CryptoJS.AES.decrypt(encryptedResponse, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const decryptedJson = JSON.parse(
    CryptoJS.enc.Utf8.stringify(decrypted)
  );

  // ================= EXTRACT REQUIRED DATA =================
  const accessToken = decryptedJson.accessToken;
  const subscriptionData = decryptedJson.subscriptionData;
  const userData = decryptedJson.responseData;

  expect(accessToken).toBeTruthy();

  // ================= OPEN DASHBOARD =================
  await page.goto(DASHBOARD_URL, { waitUntil: "domcontentloaded" });

  // ================= INJECT LOCAL STORAGE =================
  await page.addInitScript(
    ({ accessToken, subscriptionData, userData }) => {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("subscriptionData", subscriptionData);
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("isMasterAdmin", "false");
    },
    { accessToken, subscriptionData, userData }
  );

  await page.reload();

  // ================= FINAL ASSERT =================
  await expect(page).toHaveURL(/dashboard/);
}

module.exports = { authentication };
