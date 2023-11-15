const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const {
  MessageConstants,
  StatusCodesConstants,
  ParamsConstants,
  
} = require('../../../managers/notify');
const secretKey = process.env.SECRET_KEY
const {
  JwtService,
  UserService,
} = require('../../../managers/services');
const { generateAccessToken} = require('../middlewares/auth.middleware');
const models = require('../../../managers/models');

// This would be your token blacklist storage
const tokenBlacklist = new Set();
const { PushNotification } = require('../../../managers/notifications')

const options = { day: '2-digit', month: 'short', year: 'numeric' };


module.exports = {

  // Verify OTP API
    getNotify : async (req, res) => {
        try {
            const notify = await models.NotifyModel.Notify.find({});
            const notifyCount = notify.length;
            const user = req.user;
            if (!user) {
                return res.redirect('/admin/auth/login');
            }
            res.render('admin/settings/notify', { Title: "Notification list", user, notifyCount, notify , error: "Notification List" })
        } catch (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    },

    getAddNotify : async (req, res) => {
        try {
            const user = req.user;
            if (!user) {
                return res.redirect('/admin/auth/login');
            }
            res.render('admin/settings/addNotify', { Title: "Add Notification", user, error: "Add New Notification" })
        } catch (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    },

    postAddNotify : async (req, res) => {
        try {
            const user = req.user;
            if (!user) {
              return res.redirect('/admin/auth/login');
            }
            const {title , message } = req.body;

            if (!title || !message) {
              res.render('admin/settings/addNotify', { Title: "Add Notification", user, error: "Required Field Are Missing" })
            }
              const notificationData = {
                title,
                message
              }

              const notification = new models.NotifyModel.Notify(notificationData);
              await notification.save();

              console.log("Notification Added successfully");
              res.redirect('/admin/auth/settings/notification');

            res.render('admin/settings/addNotify', { Title: "Add Notification", user, error: "Add New Notification" })
        } catch (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    },

    getUpdateNotify : async (req, res) => {
      try {
          const user = req.user;
          console.log(req)
          const notify_id = req.params.id;
          console.log("Param -id ",notify_id);
          if (!user) {
              return res.redirect('/admin/auth/login');
          }

          const notification = await models.NotifyModel.Notify.findOne({_id : notify_id });
          console.log(notification)
          res.render('admin/settings/updateNotify', { Title: "Add Notification", notification,user, error: "Add New Notification" })
      } catch (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
      }
    },

    postUpdateNotify : async (req, res) => {
      try {
          const user = req.user;
          if (!user) {
            return res.redirect('/admin/auth/login');
          }

          const notify_id = req.params.id;
          const {title , message } = req.body;

          if (!title || !message) {
            res.render('admin/settings/updateNotify', { Title: "Add Notification", user, error: "Required Field Are Missing" })
          }
            const notificationData = {
              title,
              message
            }

            const notification = await models.NotifyModel.Notify.findOne({_id : notify_id});

            notification.title = notificationData.title
            notification.message = notificationData.message
            await notification.save();

            console.log("Notification Added successfully");
            res.redirect('/admin/auth/settings/notification');

          res.render('admin/settings/addNotify', { Title: "Add Notification", user, error: "Add New Notification" })
      } catch (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
      }
    },

    sendNotification : async (req, res) => {
      try {
        const user = req.user;
        if (!user) {
          return res.redirect('/admin/auth/login');
        }

        const notify_id = req.params.id;

          const notification = await models.NotifyModel.Notify.findOne({_id : notify_id});

          const users = await models.UserModel.User.find({usertype : "Customer"});

          const userIds = users.map(user => user._id);

          console.log(userIds)
          const messageData = {
            title : notification.title,
            message : notification.message,
          }

          PushNotification.sendPushNotification(userIds, messageData)

          console.log("Notification Added successfully");

        res.render('admin/settings/notify', { Title: "Add Notification", user, error: "Add New Notification" })
      } catch (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
      }
    }
}

