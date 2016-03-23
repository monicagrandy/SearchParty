'use strict'

const apiConfig = require('../config/config.js');
const oauth = require('oauth');
const oauthSig = require('oauth-signature');
const qs = require('querystring');


module.exports = {
  generateOauthCredentials: (keyword, geolocation) => {
    let method = 'GET';
    let limit = 10;
    let url = 'http://api.yelp.com/v2/search';

    const randomString = (length, chars) => {
       let randStr = '';
       for(var i = length; i > 0; --i) {
          randStr += chars[Math.round(Math.random() * (chars.length - 1))];
       }
       return randStr;
    };

    let oauth = {
       term: keyword,
       limit: limit,
       ll: `${geolocation.lat},${geolocation.lng}`,
       oauth_consumer_key: apiConfig.oAuthConsumerKey,
       oauth_token: apiConfig.oAuthToken,
       oauth_signature_method: "HMAC-SHA1",
       oauth_timestamp: new Date().getTime(),
       oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
       oauth_version: "1.0"
    };
    let signature = oauthSig.generate(method, url, oauth, apiConfig.yelpConsumerSecret, apiConfig.yelpTokenSecret, { encodeSignature: false});
    oauth.oauth_signature = signature;
    let paramURL = qs.stringify(oauth);
    paramURL = paramURL.replace('%2C', ',');
    let apiURL = url + '?' + paramURL;
    return apiURL;
  }
}
