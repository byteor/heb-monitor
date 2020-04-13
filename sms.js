const accountSid = process.env.TWILIO_API_SID;
const authToken = process.env.TWILIO_API_TOKEN;
const twilio = require('twilio');

const client = new twilio(accountSid, authToken);
const phones = [process.env.TWILIO_API_PHONES_TO.split(',')];

export const sendSms = (text) => {
    phones.forEach(phone => {
        client.messages.create({
            body: text,
            to: phone,  // Text this number
            from: process.env.TWILIO_API_PHONE_FROM // From a valid Twilio number
        }).then((message) => console.log(message.sid)).catch(error => console.log(error));
    });
};

