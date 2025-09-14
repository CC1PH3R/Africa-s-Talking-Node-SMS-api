require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sms } = require('./atClient');
//console.log('sms object:', sms);
//console.log('sms.send type:', typeof sms.send);


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* SMS Endpoint */ 
app.post('/sms/send', async (req, res) => {
    try {
        const { to, message } = req.body;
        const response = await sms.send({
            to,
            message,
            from: process.env.AT_SENDER_ID,
            enqueue: true
        });
        console.log('SMS send response:', response);
        return res.json({ success: true, data: response });
    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

/* Ngrok Test */
// Test via browser http:abcdefgh.ngrok-free.app/test
app.get('/test', (req, res) => {
    console.log('Test endpoint hit!');
    res.json({ message: 'Server is reachable via ngrok' });
});

/* Delivery Callback*/
app.post('/callback', (req, res) => {
    console.log('[DR] raw callback body ->', req.body);
    res.status(200).json({
        status: "success",
        message: "Callback received"
    })
});

app.listen(process.env.PORT, () => 
    console.log(`API ready -> http://localhost:${process.env.PORT}`)
);