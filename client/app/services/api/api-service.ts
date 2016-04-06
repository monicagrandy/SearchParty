import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

@Injectable()
export class APIService {
  SINGLE_HUNT_URL: string = localStorage.singleHunt || 'https://getsearchparty.com/singleHunt'; //update this later
  ADD_MESSAGE_URL: string = localStorage.addChatMessage || 'https://getsearchparty.com/addChatMessage';
  GET_MESSAGES_URL: string = localStorage.getChatMessages || 'https://getsearchparty.com/getChatMessages';
  SIGNIN_URL: string = 'https://getsearchparty.com/signin'; 
  SIGNUP_URL: string = 'https://getsearchparty.com/signup';
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});
  urls: any;
  
  constructor(private _http:Http) {
    this.urls = {
      singleHunt: this.SINGLE_HUNT_URL,
      addChatMessage: this.ADD_MESSAGE_URL,
      getChatMessages: this.GET_MESSAGES_URL,
    }
  }
  
  getData(urlName) {
    
    let url = this.urls[urlName];
    
    console.log('called get req');
    let httpGetPromise = new Promise((resolve, reject) => {
      console.log('inside get promise');
      this._http.get(url)
        .map(res => res.json())
        .subscribe(
          data => {
            console.log('data from promise: ', data);
            resolve(data);
          },
          err => {
            this.logError(err);
            reject(err);
          },
          () => console.log('data recieved')
          )
        })
        
    return httpGetPromise;
  }
  
  postData(dataObj, urlName) {
    
    let url = this.urls[urlName];
    
    let httpPostPromise = new Promise((resolve, reject) => {
      console.log('inside post promise');
      this._http.post(url, JSON.stringify(dataObj), {headers: this.contentHeader})
        .map(res => res.json())
        .subscribe(
          data => {
            console.log('data from promise: ', data);
            resolve(data);
          },
          err => {
            this.logError(err);
            reject(err);
          },
          () => console.log('data recieved')
          )
        });
        
    return httpPostPromise; 
  }

  logError(err) {
    console.error('There was an error: ' + err);
  }
}  