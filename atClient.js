// A thin wrapper around the AfricasTalking SDK
require('dotenv').config();
const AfricasTalking = require('africastalking');

const credentials = {
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME
};

const AT = AfricasTalking(credentials);
exports.sms = AT.SMS;