const fs = require('fs');
const path = require('path');
var FCM = require('fcm-node');
const models = require('../models')

module.exports = {  
  sendPushNotification: async (userIds, message) => {
    try {
        console.log('User Ids:- ', userIds);
        console.log('Message:- ', message);

        // Read Firebase configuration from the JSON file
        const jsonString = fs.readFileSync(path.join(__dirname, './FireBaseConfig.json'), 'utf8');
        const data = JSON.parse(jsonString);
        const serverKey = data.SERVER_KEY;
        const fcm = new FCM(serverKey);

        // Retrieve FCM tokens for the specified user IDs
        const pushTokens = await models.UserModel.Device.find({ user_id: { $in: userIds } });
        console.log(pushTokens)
        const regIds = pushTokens.map(token => token.fcm_token);

        console.log('Registration IDs:', regIds);

        if (regIds.length > 0) {
            const pushMessage = {
                registration_ids: regIds,
                content_available: true,
                mutable_content: true,
                notification: {
                    body: message,
                    icon: 'myicon', // Default Icon
                },
            };

            console.log("Message --- ", pushMessage);

            // Send the push notification
            fcm.send(pushMessage, function (err, response) {
                console.log("Message --- I am here");
                if (err) {
                    console.log("Something has gone wrong!", err);
                } else {
                    console.log("Push notification sent.", response);
                }
            });
        }

    } catch (error) {
        console.log(error);
    }
},

}


