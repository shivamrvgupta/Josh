const AWS = require('aws-sdk');


module.exports = {
    savetobucket : async (file, title) => {
        try {
            const s3 = new AWS.S3();
            const param = {
                Bucket : process.env.AWS_BUCKET_NAME,
                Key : `uploads/${title}`,
                Body : file.buffer
            }
            return await s3.upload(param).promise();
        } catch (error) {
            console.log(error)
        }
    }

}

    
