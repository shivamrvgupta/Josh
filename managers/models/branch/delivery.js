const mongoose = require('mongoose');

const deliveryScheme = new mongoose.Schema({
    branch_id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
    },
    delivery_fee : {
        type : String,
        default : "0.00"
    },
    created_date : {
      type : Date,
      default : Date.now
    }
});

const DeliveryFees = mongoose.model('DeliveryFee', deliveryScheme);

module.exports = DeliveryFees;