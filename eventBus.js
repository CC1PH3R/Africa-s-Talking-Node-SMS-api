import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/* Simple in-memory queue */
const queue = [];
let processing = false;

export function publish(type, payload) { return queue.push({ type, payload }); }

/* Worker loop */
async function worker() {
    if (processing) return;
    processing = true;
    while (queue.length){
        const { type, payload } = queue.shift();
        if (type === 'dlr') await saveDLR(payload);
        if (type === 'retry') await handleRetry(payload);
    }
    processing = false;
}
setInterval(worker, 3_000); // every 3s

async function saveDLR(body) {
    await prisma.message.updateMany({
        where: { id: body.id },
        data: {
            status: body.status,
            updatedAt: new Date()
        }
    });
    console.log('DLR saved to DB for message ID:', body.id);    
}

async function handleRetry({ id, phoneNumber, text, sender }) {
    const { sms } = require('./atClient');
    try {
        await sms.send({ to: phoneNumber, message: text, from: sender, enqueue: true });
        await prisma.message.update({ where: { id }, data: { status: 'Re-sent' } });
        console.log('Message re-sent successfully for ID:', id);
    } catch (error) {
        console.error('Error re-sending message for ID:', id, error);
        await prisma.message.update({ where: { id }, data: { retries: { increment: 1 } } });
    }
}