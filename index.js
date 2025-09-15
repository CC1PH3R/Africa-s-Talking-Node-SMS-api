import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { sms } from './atClient.js';
import { publish } from './eventBus.js';
//console.log('sms object:', sms);
//console.log('sms.send type:', typeof sms.send);

dotenv.config();
const prisma = new PrismaClient();
const app = express();
app.use(cors());

/* SMS Endpoint */ 
app.post('/sms/send', json(), async (req, res) => {
    try {
        const { to, message } = req.body;
        const atResponse = await sms.send({
            to,
            message,
            from: process.env.AT_SENDER_ID,
            enqueue: true
        });
        console.log('AT Full SMS Response:', atResponse);

        // save outgoing message to DB
        const msg = await prisma.message.create({
            data: {
                id: atResponse.SMSMessageData.Recipients[0].messageId,
                phoneNumber: to,
                text: message,
                status: 'Sent',
            }
        });
        return res.json({ success: true, data: atResponse });
        
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

/*  ------  delivery report  (stateless, ≤ 30 s)  ------  */
app.post('/callback', urlencoded({ extended: true }), (req, res) => {
    console.log('[DR] raw callback body ->', req.body);
    publish('dlr', req.body);
    res.status(200).json({
        status: "success",
        message: "Callback received"
    })
});

app.listen(process.env.PORT, () => 
    console.log(`API ready -> http://localhost:${process.env.PORT}`)
);