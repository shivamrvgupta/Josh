module.exports = Object.freeze({
    OrderPlaced : async (orderId) => {
        const successMessages = [
            `Order ${orderId} placed successfully! 🎉`,
            `Your order (${orderId}) has been confirmed!`,
            `Thank you for your order (${orderId})! 🛍️`,
            `Success! Your order ${orderId} are on their way!`,
            `Order ${orderId} received and processing.`,
        ];
    
        const randomIndex = Math.floor(Math.random() * successMessages.length);
        return successMessages[randomIndex];
    },

    OrderStatus : (orderId, status) =>{
        const successMessages = [
            `Order ${orderId} is ${status}, and it will soon be delivered to you.`,
            `Your order - ${orderId} has been ${status}. We're preparing it for delivery.`,
            `Great news! Your order (${orderId}) is ${status}. It's on its way to you.`,
            `Your order - ${orderId} is now ${status}. Get ready for an amazing delivery experience!`,
            `Exciting times! Your order (${orderId}) has been successfully ${status}.`,
            `We've got your order! Order - ${orderId} is ${status} and heading your way soon.`,
            `Confirmation complete! Your order (${orderId}) is officially in our system.`,
            `Thank you for your order - ${orderId}. It's ${status}, and we're starting preparations.`,
            `Good choice! Your order (${orderId}) is ${status} and scheduled for dispatch.`,
            `Order confirmation success! Your items for order - ${orderId} are on the way.`,
            `Congratulations! Your order (${orderId}) is ${status}, and we're on it.`,
            `Fantastic news! Your order - ${orderId} is ${status} and will be with you shortly.`,
            `Order (${orderId}) ${status}! Get ready to receive your chosen items.`,
        ];
        
        const randomIndex = Math.floor(Math.random() * successMessages.length);
        return successMessages[randomIndex];

    },

    OrderDelivered : (orderId) =>{
        const successMessages = [
            `Your order - ${orderId} has been successfully delivered. Enjoy your purchase!`,
            `Congratulations! Your order (${orderId}) is now safely in your hands.`,
            `Good news! Your package for order - ${orderId} has arrived.`,
            `The wait is over! Your order (${orderId}) has been delivered.`,
            `Thank you for choosing us! Your order - ${orderId} has reached its destination.`,
            `We're excited to let you know that your order (${orderId}) has been delivered securely.`,
            `Great job! Your order - ${orderId} is officially delivered.`,
            `Celebrate the moment! Your order (${orderId}) has been successfully delivered.`,
            `You've got mail! Well, actually, it's your order - ${orderId} that has been delivered.`,
            `Time to unwrap happiness! Your order (${orderId}) has arrived.`
        ];

        const randomIndex = Math.floor(Math.random() * successMessages.length);
        return successMessages[randomIndex];
    },

    OrderCancelled : (orderId) =>{
        const successMessages = [
            `We're sorry to hear that you've cancelled your order - ${orderId}. If you have any concerns, please let us know.`,
            `Order (${orderId}) cancellation successful. If you have any feedback, feel free to share it with us.`,
            `Your order - ${orderId} has been cancelled as per your request. We hope to serve you better next time.`,
            `Cancellation confirmed! Order (${orderId}) won't be processed. If you have questions, reach out to us.`,
            `We've received your cancellation request for order - ${orderId}. Let us know if there's anything we can do for you.`,
            `Order cancellation processed. If you need assistance or have further questions, please contact our support team.`,
            `Cancelled! Your order (${orderId}) won't proceed. If you have any concerns, don't hesitate to get in touch.`,
            `Sorry to see you go! Order (${orderId}) cancellation successful. If you change your mind, we're here to help.`,
            `Order - ${orderId} cancellation complete. If you have any issues or need assistance, feel free to reach out.`,
            `Cancellation confirmed for order (${orderId}). If you have feedback or need further assistance, let us know.`,
        ];

        const randomIndex = Math.floor(Math.random() * successMessages.length);
        return successMessages[randomIndex];
    }
});