const admin = require("firebase-admin");
const serviceAccount = require("../utils/firebase_service_account/meet-humee-firebase-adminsdk-fbsvc-d7e308c4e7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
