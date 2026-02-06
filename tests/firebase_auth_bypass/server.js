const express = require('express');
const {generateTestToken} = require('./authController');

const app = express();

app.use(express.json());

app.post("/auth/firebase-token", generateTestToken);

app.listen(3000, () => {
    console.log("Auth server running on port 3000");
});