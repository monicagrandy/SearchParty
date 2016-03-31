import { Injectable } from 'angular2/core';


@Injectable()
  export class TweetButtonService {
    finalDist: any;
    tweetcontainer = null;
    
    constructor(){}
    
    getButton(button, text) {
      let buttonPromise = new Promise((resolve, reject) => {
        console.log('inside tweet button service');
        this.tweetcontainer = button;
        this.tweetcontainer = twttr.widgets.createShareButton(
          `${text}`,
          document.getElementById('tweetcontainer'),
          {
            size: 'large',
            via: 'GetSearchParty',
            related: 'twitterapi,twitter',
            text: 'I am going on an adventure! Follow me on Search Party!',
            hashtags: 'GetSearchParty'
          }
        );
        
        console.log(' this is the new tweetcontainer ', this.tweetcontainer);
        resolve(this.tweetcontainer);
            
      });
      return buttonPromise;
    }
    
  }