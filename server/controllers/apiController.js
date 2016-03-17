'use strict'

const oauth = require('oauth');
const oauthSig = require('oauth-signature');
const apiConfig = require('../db/config/config.js');
//Other users will have to go into the config/config.js and insert their own
//credentials to access the Yelp API.

module.exports = {
   yelpAPI: (keyword, geolocation, callback) => {
      const latitude = geolcation.latitude
      randomString (length, chars) => {
         let randStr = '';
         for(var i = length; i > 0; --i) {
            randStr += chars[Math.round(Math.random() * (chars.length - 1))];
         }
         console.log('RandomString Generated: ' + randString(32, 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ))
         return randStr;
      };
      let method = 'GET';
      let url = 'http://api.yelp.com/v2/search';
      let params = {
         // location: 'Los+Angeles',  //Instead of serach by city, we hand it cll=lat, long
         cll: (geolcation.latitude, geolocation.longitude),
         oauth_consumer_key: apiConfig.yelpConsumerKey,
         oauth_token: apiConfig.yelpToken,
         oauth_signature_method: "HMAC-SHA1",
         oauth_timestamp: new Date().getTime(),
         oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
         term: keyword,
         limit: 10
      };
      let consumerSecret = apiConfig.yelpConsumerSecret;
      let tokenSecret = apiConfig.yelpTokenSecret;
      let signature = oauth_signature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false});

      params['oauth-signature'] = signature;
      //Returns a list of 10 bars rated closest to current location (according to Yelp);
      $http.jsonp(url, {params: params}).then(callback);
   }
};
