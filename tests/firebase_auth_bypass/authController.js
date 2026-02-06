const admin = require("./firebaseAdmin");

const generateTestToken = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: "phoneNumber is required" });
    }

    let userRecord;

    // 1️⃣ Try to get existing Firebase user
    try {
      userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);
    } catch (err) {
      // 2️⃣ If not exists, create user
      userRecord = await admin.auth().createUser({
        phoneNumber,
      });
    }

    // 3️⃣ Generate custom token
    const customClaims = {
      phoneNumber,
      role: "qa-test",
    };

    const token = await admin
      .auth()
      .createCustomToken(userRecord.uid, customClaims);

    return res.status(200).json({
      uid: userRecord.uid,
      phoneNumber,
      token,
    });
  } catch (error) {
    console.error("Error generating Firebase token:", error);
    return res.status(500).json({ error: "Failed to generate token" });
  }
};

module.exports = { generateTestToken };
