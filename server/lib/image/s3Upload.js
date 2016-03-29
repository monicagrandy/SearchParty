'use strict'

const config = require('../../config/config');
let AWS = require('aws-sdk'); 
AWS.config.update({accessKeyId: config.aws_access_key_id, secretAccessKey: config.aws_secret_access_key, region: 'us-west-2'});


module.exports = {
  sendToS3: (img, key) => {
  console.log('this is the img coming into the sendToS3 function ', img);
    let s3 = new AWS.S3(); 
    console.log('this is the s3 variable ', s3);
    s3.createBucket({Bucket: 'searchpartytest'}, () => {
    let buf = new Buffer(img.replace(/^data:image\/\w+;base64,/, ""),'base64')
    let params = {Bucket: 'searchpartytest', ContentEncoding: 'base64', ContentType: 'image/jpeg', ACL: 'public-read', Key: key, Body: buf};
    s3.upload(params, (err, data) => {
      return new Promise((resolve, reject) => {
        if (err) {       
          reject(err)
        } else {
          console.log("Successfully uploaded data: ", data);
          resolve(data.Location)
        }      
      })     
    });
  });
 }   
}

