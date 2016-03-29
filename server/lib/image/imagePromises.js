'use strict'
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');
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
      return s3.upload(params, (err, data) => {
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
  },
  insertURLIntoDB: (huntID, url) => {
    let insertImageURLQuery = `MATCH (hunt:Hunt{huntID:"${huntID}"})
    CREATE (hunt)-[:HAS_PIC]->(pic:Picture{url:"${url}"})
    RETURN pic.url`;

    return neo4jPromise.databaseQueryPromise(insertImageURLQuery)
    .then(url => {
      return new Promise((resolve, reject) => {
        if(url.length > 0) {
          resolve(url);
        } else {
          reject({"error": "could not insert url into database"});
        }
      })
    }).catch(error => console.error(error));
  },
  getImagesBasedOnHunt: huntID => {
    let grabHuntImagesQuery = `MATCH (hunt:Hunt{huntID:"${huntID}"})-[:HAS_PIC*]->(picurl)
    WITH COLLECT(DISTINCT picurl) AS urls
    RETURN urls`;

    return neo4jPromise.databaseQueryPromise(grabHuntImagesQuery)
    .then(imageURLArray => {
      console.log("image url array", imageURLArray);
      return new Promise((resolve, reject) => {
        if(imageURLArray.length > 0) {
          resolve(imageURLArray);
        } else {
          reject({"error": "could not get images from db"});
        }
      })
    })
  }
}
