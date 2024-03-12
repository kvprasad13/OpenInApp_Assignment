
const Task = require('../models/task.js');
const User = require('../models/user.js');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);
async function makeVoiceCall(userPhoneNumber, myNumber) {
    try {
        // Implement Twilio voice call logic here
        await client.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml',
            to: "+91" + userPhoneNumber,
            from: myNumber
        });
        console.log('Voice call made to:', userPhoneNumber);
        return true;
    } catch (error) {
        console.error('Error making voice call:', error);
        return false;
    }
}

const makeCallsToUser = async () => {

    try {


        const myNumber = process.env.MY_TWILIO_PHONE_NUMBER


        const tasksPastDue = await Task.find({ due_date: { $lt: new Date() } });

        const users = [];
        for (const task of tasksPastDue) {
            const user = await User.findOne({ _id: task.user_id });
            if (!users.includes(user))
                users.push(user);
        }
        users.sort((a, b) => a.priority - b.priority);
        for (const user of users) {

            try {
                await makeVoiceCall(user.phone_number, myNumber);
            }
            catch (err) {
                throw new Error("Making voice call failed for user's phone number " + user.phone_number)
            }


        }
    } catch (error) {
        console.error('Error making voice calls:', error);
    }
}
module.exports = { makeCallsToUser };



