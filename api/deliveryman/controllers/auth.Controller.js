const jwt = require('jsonwebtoken');
const fs = require('fs'); // Import the 'fs' module for file operations
const bcrypt = require('bcrypt');
const { promisify } = require('util');  
const axios = require('axios'); // Import the axios library
const { v4: uuidv4 } = require('uuid');
const path = require("path"); 
const {
  MessageConstants,
  StatusCodesConstants,
  ParamsConstants,
  
} = require('../constants');
const { AuthMiddleware } = require('../middlewares');
const { Validator } = require('../../../managers/utils');
const { AuthHelper, OtpHelper } = require('../../../managers/helpers');
const secretKey = process.env.SECRET_KEY
const {
  JwtService,
  UserService,
} = require('../../../managers/services');
const { generateAccessToken, initializeRevokedTokens } = require('../middlewares/auth.middleware');
const models = require('../../../managers/models');
const { PushNotification } = require('../../../managers/notifications')
// This would be your token blacklist storage
const tokenBlacklist = new Set();
const { Mailer } = require('../../../mailer')


module.exports = {
// User Login API
  login : async (req, res) => {
    const loginData = {
      email: req.body.email,
      password: req.body.password,
    };
  
    console.log(req.body);
  
    const validationResult = Validator.validate(loginData, {
      email: {
        presence: { allowEmpty: false },
      },
      password: {
        presence: { allowEmpty: false },
      },
    });
  
    if (validationResult) {
      return res.status(StatusCodesConstants.BAD_REQUEST).json({
        status: false,
        status_code: StatusCodesConstants.BAD_REQUEST,
        message: MessageConstants.VALIDATION_ERROR,
        data: validationResult,
      });
    }
  
    try {
      // Check if the user with the provided email exists in the database
      const user = await models.UserModel.DeliveryMan.findOne({ email: loginData.email });
  
      if (!user) {
        return res.status(StatusCodesConstants.NOT_FOUND).json({
          status: false,
          status_code: StatusCodesConstants.NOT_FOUND,
          message: 'User Not Found',
          data: {},
        });
      }
  
      // Verify the password
      const passwordMatch = await bcrypt.compare(loginData.password, user.password);
      console.log(user.password)
      console.log(loginData.password)

      if (!passwordMatch) {
        return res.status(StatusCodesConstants.UNAUTHORIZED).json({
          status: false,
          status_code: StatusCodesConstants.UNAUTHORIZED,
          message: 'Invalid Password',
          data: {},
        });
      }
  
      // If email and password are correct, generate a JSON Web Token (JWT)
      const token = AuthMiddleware.generateAccessToken(user);

      const responseData = {
        profile: user.deliveryman_image,
        first_name: user.fname,
        last_name: user.lname,
        email: user.email,
        phone_number: user.phone,
      };
      console.log("Token ---- ",token)
  
      return res.status(StatusCodesConstants.SUCCESS).json({
        status: true,
        status_code: StatusCodesConstants.SUCCESS,
        message: 'Login Successful',
        data: { responseData ,token },
      });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(StatusCodesConstants.INTERNAL_SERVER_ERROR).json({
        status: false,
        status_code: StatusCodesConstants.INTERNAL_SERVER_ERROR,
        message: MessageConstants.INTERNAL_SERVER_ERROR,
        data: {},
      });
    }
  },

// Get User Data
  getUser : async (req, res) => {
    try {
      const session = req.user;
      user_id = session.userId;
      if(!user_id){
        return res.status(StatusCodesConstants.BAD_REQUEST).json({
          status: false,
          status_code: StatusCodesConstants.BAD_REQUEST,
          message: 'Please Login First',
        })
      }

      // Fetch the full data of user
      const user = await models.UserModel.DeliveryMan.findOne({ _id : user_id });
      if (!user) {
        return res.status(StatusCodesConstants.BAD_REQUEST).json({
          status: false,
          status_code: StatusCodesConstants.BAD_REQUEST,
          message: 'User Not Found',
        });
      }

      // Combine the fetched data into a single response
      const data = {
        user,
      };

      return res.status(StatusCodesConstants.SUCCESS).json({
        status: true,
        status_code: StatusCodesConstants.SUCCESS,
        message: 'User data fetched successfully',
        data : data,
      });

    }
    catch (error) {
      console.error(error);
      return res.status(StatusCodesConstants.INTERNAL_SERVER_ERROR).json({
        status: false,
        status_code: StatusCodesConstants.INTERNAL_SERVER_ERROR,
        message: MessageConstants.INTERNAL_SERVER_ERROR,
      });
    }
  },

  getProfile : async (req, res) => {
    try {
      const session = req.user;
      user_id = session.userId;
      if(!user_id){
        return res.status(StatusCodesConstants.BAD_REQUEST).json({
          status: false,
          status_code: StatusCodesConstants.BAD_REQUEST,
          message: 'Please Login First',
        })
      }

      // Fetch the full data of user
      const user = await models.UserModel.DeliveryMan.findOne({ _id : user_id });
      if (!user) {
        return res.status(StatusCodesConstants.BAD_REQUEST).json({
          status: false,
          status_code: StatusCodesConstants.BAD_REQUEST,
          message: 'User Not Found',
        });
      }

      const responseData = {
        profile_img: user.deliveryman_image,
        first_name: user.fname,
        last_name: user.lname,
        email: user.email,
        phone_number: user.phone,
      };

      const message = "Hello User"

      PushNotification.sendPushNotification(user_id, message)

      return res.status(StatusCodesConstants.SUCCESS).json({
        status: true,
        status_code: StatusCodesConstants.SUCCESS,
        message: 'User data fetched successfully',
        data : responseData,
      });
    }
    catch (error) {
      console.error(error);
      return res.status(StatusCodesConstants.INTERNAL_SERVER_ERROR).json({
        status: false,
        status_code: StatusCodesConstants.INTERNAL_SERVER_ERROR,
        message: MessageConstants.INTERNAL_SERVER_ERROR,
      });
    }
  },

  logout:(req, res) => {
    const session = req.user;
    const user_id = session.userId;
    const user_token = req.token ;
  
    if (user_token) {
      // Add the token to the revokedTokens set to invalidate it
      initializeRevokedTokens(user_id, user_token);

      console.log(initializeRevokedTokens)
  
      return res.status(StatusCodesConstants.SUCCESS).json({
        status: true,
        message: MessageConstants.USER_LOGGED_OUT,
      });
    } else {
      return res.status(StatusCodesConstants.ACCESS_DENIED).json({
        status: false,
        message: MessageConstants.ACCESS_DENIED_ERROR,
      });
    }
  },

}

