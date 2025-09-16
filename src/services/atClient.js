// A thin wrapper around the AfricasTalking SDK
import dotenv from 'dotenv';
import AfricasTalking from 'africastalking';

dotenv.config();
const credentials = {
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME
};

const AT = AfricasTalking(credentials);
export const sms = AT.SMS;