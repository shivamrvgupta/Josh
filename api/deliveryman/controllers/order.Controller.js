const { MessageConstants, StatusCodesConstants } = require('../constants');
const { Validator } = require('../../../managers/utils');
const models = require('../../../managers/models');
  
module.exports = {
    // Get Order Data
        orderList: async (req, res) => {
            try {
                // Extract user session information
                const session = req.user;
                const user_id = session.userId;
        
                // Check if the user is logged in
                if (!user_id) {
                    return res.status(StatusCodesConstants.ACCESS_DENIED).json({
                        status: false,
                        status_code: StatusCodesConstants.ACCESS_DENIED,
                        message: MessageConstants.NOT_LOGGED_IN,
                    });
                }
        
                console.log(user_id)
                // Query the database to fetch orders for the user
                const orders = await models.BranchModel.Order.find({
                    delivery_id: user_id,
                }).sort({ updated_date: -1 });

        
                // Check if any orders were found
                if (orders && orders.length > 0) {
                    const populatedOrder = [];
        
                    for (const order of orders) {
                        // Fetch product details for each order item
                        const productData = await Promise.all(order.product_items.map(async (product) => {
                            const productInfo = await models.BranchModel.BranchProduct.findOne({ _id: product.product_id });
                            if (productInfo) {
                                return {
                                    "product_id": product.product_id,
                                    "product_name": productInfo.name,
                                    "product_img": productInfo.image,
                                    "quantity": product.quantity,
                                    "price": product.price,
                                };
                            }
                            return null;
                        }));
        
                        // Fetch branch, delivery, and address details
                        const branchInfo = await models.BranchModel.Branch.findOne({ _id: order.branch_id });
                        const deliveryInfo = order.is_delivery_man_assigned
                            ? await models.UserModel.DeliveryMan.findOne({ _id: order.delivery_id })
                            : null;
                        const addressInfo = await models.UserModel.Address.findOne({ _id: order.address_id });
                        const customerInfo = await models.UserModel.User.findOne({ _id: order.user_id });


                        // Construct data objects

                        const userData = {
                            profile: customerInfo.profile,
                            first_name: customerInfo.first_name,
                            last_name: customerInfo.last_name,
                            email: customerInfo.email,
                            phone_number: customerInfo.phone,
                            company: customerInfo.company,
                          };

                        const addressData = {
                            address_id: addressInfo._id,
                            address_1: addressInfo.address_1,
                            area: addressInfo.area,
                            city: addressInfo.city,
                            state: addressInfo.state,
                        };
        
                        const branchData = {
                            branch_id: branchInfo._id,
                            branch_name: branchInfo.name,
                            branch_city: branchInfo.city,
                        };
        
                        const orderData = {
                            order_id: order.order_id,
                            coupon_discount: order.coupon_discount,
                            delivery_fee: order.delivery_fee,
                            total_price: order.total_price,
                            delivery_date: order.delivery_date,
                            delivery_time: order.delivery_time,
                            payment_method: order.payment_method,
                            note: order.note,
                            status: order.status,
                            grand_total: order.grand_total,
                        };
        
                        const deliveryManData = order.is_delivery_man_assigned
                            ? {
                                deliveryMan_id: deliveryInfo._id,
                                deliveryMan_name: deliveryInfo.name,
                            }
                            : {
                                deliveryMan_name: order.delivery_man,
                            };
        
                        // Construct the order item data
                        const orderItemData = {
                            order_detail: orderData,
                            ordered_products: productData,
                            ordered_branch: branchData,
                            ordered_user : userData,
                            ordered_address: addressData,
                            assigned_deliveryMan: deliveryManData,
                            
                        };
        
                        populatedOrder.push(orderItemData);
                    }
        
                    console.log(`User ${session.first_name} ${MessageConstants.ORDER_FETCHED_SUCCESSFULLY}`);
                    return res.status(StatusCodesConstants.SUCCESS).json({
                        status: true,
                        status_code: StatusCodesConstants.SUCCESS,
                        message: MessageConstants.ORDER_FETCHED_SUCCESSFULLY,
                        data: {
                            orders: populatedOrder,
                        },
                    });
                } else {
                    // No orders found for the user
                    console.log("No orders found");
                    return res.status(StatusCodesConstants.SUCCESS).json({
                        status: true,
                        status_code: StatusCodesConstants.SUCCESS,
                        message: MessageConstants.ORDER_NOT_FOUND,
                        data: {
                            orders: [],
                        },
                    });
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                return res.status(StatusCodesConstants.INTERNAL_SERVER_ERROR).json({ error: MessageConstants.INTERNAL_SERVER_ERROR });
            }
        },
    
    // Get Order Data
        perOrder: async (req, res) => {
            try {
                // Extract user session information
                const session = req.user;
                const user_id = session.userId;
                const order_id = req.body.order_id;
        
                // Check if the user is logged in
                if (!user_id) {
                    return res.status(StatusCodesConstants.ACCESS_DENIED).json({
                        status: false,
                        status_code: StatusCodesConstants.ACCESS_DENIED,
                        message: MessageConstants.NOT_LOGGED_IN,
                    });
                }
        
                // Query the database to fetch orders for the user
                const orders = await models.BranchModel.Order.find({
                    delivery_id: user_id,
                    order_id : order_id
                });
        
                // Check if any orders were found
                if (orders && orders.length > 0) {
                    const populatedOrder = [];
        
                    for (const order of orders) {
                        // Fetch product details for each order item
                        const productData = await Promise.all(order.product_items.map(async (product) => {
                            const productInfo = await models.BranchModel.BranchProduct.findOne({ _id: product.product_id });
                            if (productInfo) {
                                return {
                                    "product_id": product.product_id,
                                    "product_name": productInfo.name,
                                    "product_img": productInfo.image,
                                    "quantity": product.quantity,
                                    "price": product.price,
                                };
                            }
                            return null;
                        }));
        
                        // Fetch branch, delivery, and address details
                        const branchInfo = await models.BranchModel.Branch.findOne({ _id: order.branch_id });
                        const deliveryInfo = order.is_delivery_man_assigned
                            ? await models.UserModel.DeliveryMan.findOne({ _id: order.delivery_id })
                            : null;
                        const addressInfo = await models.UserModel.Address.findOne({ _id: order.address_id });
        
                        // Construct data objects
                        const addressData = {
                            address_id: addressInfo._id,
                            address_1: addressInfo.address_1,
                            area: addressInfo.area,
                            city: addressInfo.city,
                            state: addressInfo.state,
                        };
        
                        const branchData = {
                            branch_id: branchInfo._id,
                            branch_name: branchInfo.name,
                            branch_city: branchInfo.city,
                        };
        
                        const orderData = {
                            order_id: order.order_id,
                            coupon_discount: order.coupon_discount,
                            delivery_fee: order.delivery_fee,
                            total_price: order.total_price,
                            delivery_date: order.delivery_date,
                            delivery_time: order.delivery_time,
                            payment_method: order.payment_method,
                            note: order.note,
                            status: order.status,
                            grand_total: order.grand_total,
                        };
        
                        const deliveryManData = order.is_delivery_man_assigned
                            ? {
                                deliveryMan_id: deliveryInfo._id,
                                deliveryMan_name: deliveryInfo.name,
                            }
                            : {
                                deliveryMan_name: order.delivery_man,
                            };
        
                        // Construct the order item data
                        const orderItemData = {
                            ordered_address: addressData,
                            ordered_branch: branchData,
                            ordered_products: productData,
                            order_detail: orderData,
                            assigned_deliveryMan: deliveryManData,
                        };
        
                        populatedOrder.push(orderItemData);
                    }
        
                    console.log(`User ${session.first_name} ${MessageConstants.ORDER_FETCHED_SUCCESSFULLY}`);
                    return res.status(StatusCodesConstants.SUCCESS).json({
                        status: true,
                        status_code: StatusCodesConstants.SUCCESS,
                        message: MessageConstants.ORDER_FETCHED_SUCCESSFULLY,
                        data: {
                            orders: populatedOrder,
                        },
                    });
                } else {
                    // No orders found for the user
                    console.log("No orders found");
                    return res.status(StatusCodesConstants.SUCCESS).json({
                        status: true,
                        status_code: StatusCodesConstants.SUCCESS,
                        message: MessageConstants.ORDER_NOT_FOUND,
                        data: {
                            orders: [],
                        },
                    });
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                return res.status(StatusCodesConstants.INTERNAL_SERVER_ERROR).json({ error: MessageConstants.INTERNAL_SERVER_ERROR });
            }
        },

    // Get Previous Order Data        
        previousOrder: async (req, res) => {
            try {
                // Extract user session information
                const session = req.user;
                const user_id = session.userId;
        
                // Check if the user is logged in
                if (!user_id) {
                    return res.status(StatusCodesConstants.ACCESS_DENIED).json({
                        status: false,
                        status_code: StatusCodesConstants.ACCESS_DENIED,
                        message: MessageConstants.NOT_LOGGED_IN,
                    });
                }
        
                console.log(user_id)
                // Query the database to fetch orders for the user
                const orders = await models.BranchModel.Order.find({
                    delivery_id: user_id,
                    status: { $in: ["Delivered", "Cancelled"] },
                }).sort({ updated_date: -1 });                

        
                // Check if any orders were found
                if (orders && orders.length > 0) {
                    const populatedOrder = [];
        
                    for (const order of orders) {
                        // Fetch product details for each order item
                        const productData = await Promise.all(order.product_items.map(async (product) => {
                            const productInfo = await models.BranchModel.BranchProduct.findOne({ _id: product.product_id });
                            if (productInfo) {
                                return {
                                    "product_id": product.product_id,
                                    "product_name": productInfo.name,
                                    "product_img": productInfo.image,
                                    "quantity": product.quantity,
                                    "price": product.price,
                                };
                            }
                            return null;
                        }));
        
                        // Fetch branch, delivery, and address details
                        const branchInfo = await models.BranchModel.Branch.findOne({ _id: order.branch_id });
                        const deliveryInfo = order.is_delivery_man_assigned
                            ? await models.UserModel.DeliveryMan.findOne({ _id: order.delivery_id })
                            : null;
                        const addressInfo = await models.UserModel.Address.findOne({ _id: order.address_id });
                        const customerInfo = await models.UserModel.User.findOne({ _id: order.user_id });


                        // Construct data objects

                        const userData = {
                            profile: customerInfo.profile,
                            first_name: customerInfo.first_name,
                            last_name: customerInfo.last_name,
                            email: customerInfo.email,
                            phone_number: customerInfo.phone,
                            company: customerInfo.company,
                        };

                        const addressData = {
                            address_id: addressInfo._id,
                            address_1: addressInfo.address_1,
                            area: addressInfo.area,
                            city: addressInfo.city,
                            state: addressInfo.state,
                        };
        
                        const branchData = {
                            branch_id: branchInfo._id,
                            branch_name: branchInfo.name,
                            branch_city: branchInfo.city,
                        };
        
                        const orderData = {
                            order_id: order.order_id,
                            coupon_discount: order.coupon_discount,
                            delivery_fee: order.delivery_fee,
                            total_price: order.total_price,
                            delivery_date: order.delivery_date,
                            delivery_time: order.delivery_time,
                            payment_method: order.payment_method,
                            note: order.note,
                            status: order.status,
                            grand_total: order.grand_total,
                        };
        
                        const deliveryManData = order.is_delivery_man_assigned
                            ? {
                                deliveryMan_id: deliveryInfo._id,
                                deliveryMan_name: deliveryInfo.name,
                            }
                            : {
                                deliveryMan_name: order.delivery_man,
                            };
        
                        // Construct the order item data
                        const orderItemData = {
                            order_detail: orderData,
                            ordered_products: productData,
                            ordered_branch: branchData,
                            ordered_user : userData,
                            ordered_address: addressData,
                            assigned_deliveryMan: deliveryManData,
                            
                        };
        
                        populatedOrder.push(orderItemData);
                    }
        
                    console.log(`User ${session.first_name} ${MessageConstants.ORDER_FETCHED_SUCCESSFULLY}`);
                    return res.status(StatusCodesConstants.SUCCESS).json({
                        status: true,
                        status_code: StatusCodesConstants.SUCCESS,
                        message: MessageConstants.ORDER_FETCHED_SUCCESSFULLY,
                        data: {
                            orders: populatedOrder,
                        },
                    });
                } else {
                    // No orders found for the user
                    console.log("No orders found");
                    return res.status(StatusCodesConstants.SUCCESS).json({
                        status: true,
                        status_code: StatusCodesConstants.SUCCESS,
                        message: MessageConstants.ORDER_NOT_FOUND,
                        data: {
                            orders: [],
                        },
                    });
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                return res.status(StatusCodesConstants.INTERNAL_SERVER_ERROR).json({ error: MessageConstants.INTERNAL_SERVER_ERROR });
            }
        },

    // Update Order Data
        updateDeliveryStatus: async (req, res) => {
            try {
                const session = req.user;
                const user_id = session.userId;
        
                console.log(`User ${session.first_name} Fetching Order Data -- Update Order`);
        
                if (!user_id) {
                    return res.status(StatusCodesConstants.ACCESS_DENIED).json({
                        status: false,
                        status_code: StatusCodesConstants.ACCESS_DENIED,
                        message: MessageConstants.NOT_LOGGED_IN,
                    });
                }
        
                const updateData = {
                    order_id: req.body.order_id,
                    status: req.body.status,
                };
        
                const validationResult = Validator.validate(updateData, {
                    order_id: {
                        presence: { allowEmpty: false },
                        length: { minimum: 3 }
                    },
                    status: {
                        presence: { allowEmpty: false }
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
        
                const existingOrder = await models.BranchModel.Order.findOne({
                    order_id: updateData.order_id,
                    delivery_id: user_id
                });

                let isDelivered = false;
                let isCancelled = false;
            
                // Update flags based on newStatus
                if (updateData.status === 'Delivered') {
                    isDelivered = true;
                } else if (updateData.status === 'Cancelled') {
                    isCancelled = true;
                }
        
                if (existingOrder) {
                    // Find the product index within the existing order
                    existingOrder.status = updateData.status;
                    existingOrder.is_delivered = isDelivered;
                    existingOrder.is_cancelled = isCancelled;
    
                    await existingOrder.save();


                    console.log(`User ${session.first_name} ${MessageConstants.CART_UPDATE_SUCCESSFULLY}`);
                    return res.status(StatusCodesConstants.SUCCESS).json({
                        status: true,
                        status_code: StatusCodesConstants.SUCCESS,
                        message: MessageConstants.PRODUCT_UPDATE_SUCCESSFULLY,
                        data: existingOrder, // Return the updated order
                    });
                } else {
                    console.log(`Order not found for the user`);
                    return res.status(StatusCodesConstants.NOT_FOUND).json({
                        status: false,
                        status_code: StatusCodesConstants.NOT_FOUND,
                        message: MessageConstants.ORDER_NOT_FOUND,
                    });
                }
            } catch (error) {
                console.error('Error updating order:', error);
                return res.status(StatusCodesConstants.INTERNAL_SERVER_ERROR).json({ error: MessageConstants.INTERNAL_SERVER_ERROR });
            }
        },
    
    // Update Order Data
        updatePaymentStatus: async (req, res) => {
            try {
                const session = req.user;
                const user_id = session.userId;
        
                console.log(`User ${session.first_name} Fetching Order Data -- Update Order`);
        
                if (!user_id) {
                    return res.status(StatusCodesConstants.ACCESS_DENIED).json({
                        status: false,
                        status_code: StatusCodesConstants.ACCESS_DENIED,
                        message: MessageConstants.NOT_LOGGED_IN,
                    });
                }
        
                const updateData = {
                    order_id: req.body.order_id,
                    status: req.body.status,
                };
        
                const validationResult = Validator.validate(updateData, {
                    order_id: {
                        presence: { allowEmpty: false },
                        length: { minimum: 3 }
                    },
                    status: {
                        presence: { allowEmpty: false }
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
        
                const existingOrder = await models.BranchModel.Order.findOne({
                    order_id: updateData.order_id,
                    delivery_id: user_id
                });

                // Define flags for is_delivered and is_cancelled
                let payment_status = false;
            
                // Update flags based on newStatus
                if (updateData.status === 'Paid') {
                    payment_status = true;
                } else if (updateData.status === 'Unpaid') {
                    payment_status = false;
                }
        
                if (existingOrder) {
                    // Find the product index within the existing order
                    existingOrder.payment_status = payment_status;
    
                    await existingOrder.save();


                    console.log(`User ${session.first_name} ${MessageConstants.CART_UPDATE_SUCCESSFULLY}`);
                    return res.status(StatusCodesConstants.SUCCESS).json({
                        status: true,
                        status_code: StatusCodesConstants.SUCCESS,
                        message: MessageConstants.PRODUCT_UPDATE_SUCCESSFULLY,
                        data: existingOrder, // Return the updated order
                    });
                } else {
                    console.log(`Order not found for the user`);
                    return res.status(StatusCodesConstants.NOT_FOUND).json({
                        status: false,
                        status_code: StatusCodesConstants.NOT_FOUND,
                        message: MessageConstants.ORDER_NOT_FOUND,
                    });
                }
            } catch (error) {
                console.error('Error updating order:', error);
                return res.status(StatusCodesConstants.INTERNAL_SERVER_ERROR).json({ error: MessageConstants.INTERNAL_SERVER_ERROR });
            }
        },
        
    // Delete API 
        deleteOrder : async (req, res) => {
            try {
                const session = req.user;
                user_id = session.userId;
    
                console.log(`User ${session.first_name} Fetching Order Data`)
    
                if(!user_id){
                    return res.status(StatusCodesConstants.ACCESS_DENIED).json({
                    status: false,
                    status_code: StatusCodesConstants.ACCESS_DENIED,
                    message: MessageConstants.NOT_LOGGED_IN,
                    })
                }


                const orderId = req.body.order_id;
            
                // Locate the order by its ID
                const order = await models.BranchModel.Order.findOne(
                    { 
                        order_id: orderId,
                        user_id : user_id,
                    });
            
                if (!order) {
                  return res.status(StatusCodesConstants.SUCCESS).json({
                    status: false,
                    status_code: StatusCodesConstants.SUCCESS,
                    message: MessageConstants.ORDER_NOT_FOUND,
                    data : []
                  });
                }
            
                if (order.status === "Cancelled") {
                    // Condition 2: If the order status is "Cancelled"                
                    return res.status(StatusCodesConstants.SUCCESS).json({
                        status: true,
                        status_code: StatusCodesConstants.SUCCESS,
                        message: MessageConstants.ORDER_ALREADY_Cancelled,
                        data : {
                            order : []
                        }
                    });
                } else if (order.status === "Returned" || order.status === "Failed" || order.status === "Delivered" || order.status === "Out For Delivery") {                
                    const message = `${MessageConstants.ORDER_NOT_DELETE} --- cause ${order.status} `
                    return res.status(StatusCodesConstants.SUCCESS).json({
                        status: true,
                        status_code: StatusCodesConstants.SUCCESS,
                        message: MessageConstants.ORDER_NOT_DELETE,
                        data : message
                    });
                } else {
                    // Update the order's status to "cancel" (or any desired status)
                    order.status = 'Cancelled'; // Update to your desired status
                    order.is_cancelled = true
                
                    // Save the updated order
                    await order.save();
                
                    console.log(`Order ${orderId} has been canceled by ${session.first_name, session.last_name}.`);
                
                    return res.status(StatusCodesConstants.SUCCESS).json({
                    status: true,
                    status_code: StatusCodesConstants.SUCCESS,
                    message: MessageConstants.ORDER_DELETED,
                    data : order
                    });
                }
              } catch (error) {
                console.error('Error canceling order:', error);
                return res.status(StatusCodesConstants.INTERNAL_SERVER_ERROR).json({
                  status: false,
                  status_code: StatusCodesConstants.INTERNAL_SERVER_ERROR,
                  message: MessageConstants.INTERNAL_SERVER_ERROR,
                });
              }
        }
}  
  
  
  