const mongoose = require('mongoose');

const notifyScheme = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    message : {
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        default: true
    },
    created_date : {
      type : Date,
      default : Date.now
    }
});

const Notify = mongoose.model('Notify', notifyScheme);

module.exports = Notify;