import {Storage, LocalStorage} from 'ionic-angular';
import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

@Injectable()
export class APIService {
  local: Storage = new Storage(LocalStorage);
  SINGLE_HUNT_URL: string = localStorage.singleHunt || 'https://getsearchparty.com/singleHunt';
  ADD_MESSAGE_URL: string = localStorage.addChatMessage || 'https://getsearchparty.com/addChatMessage';
  GET_MESSAGES_URL: string = localStorage.getChatMessages || 'https://getsearchparty.com/getChatMessages';
  FEEDBACK_URL: string = localStorage.feedback || 'https://getsearchparty.com/feedback';
  TASKS_URL: string = localStorage.tasks || 'https://getsearchparty.com/tasks';
  UPLOAD_URL: string = localStorage.upload || 'https://getsearchparty.com/upload';
  GET_PICS_URL: string = localStorage.getPics || 'https://getsearchparty.com/getPics';
  USER_PROFILE_URL: string = localStorage.userProfile || 'https://getsearchparty.com/userProfile';
  ADD_FRIEND_URL: string = localStorage.addFriend || 'https://getsearchparty.com/addFriend';
  GET_FRIENDS_URL: string = localStorage.getFriends || 'https://getsearchparty.com/getFriends';
  ADD_FRIEND_TO_HUNT_URL: string = localStorage.addFriendToHunt || 'https://getsearchparty.com/addFriendToHunt';
  GET_FRIEND_HUNT_URL: string = localStorage.getFriendHunt || 'https://getsearchparty.com/getFriendHunt';
  GET_ADDED_HUNTS_URL: string = localStorage.getAddedHunts || 'https://getsearchparty.com/getAddedHunts';
  TEMPLATES_URL: string = localStorage.templates || 'https://getsearchparty.com/templates';
  SINGLE_TEMPLATE_URL: string = localStorage.singleTemplate || 'https://getsearchparty.com/singleTemplate';
  SIGNIN_URL: string = localStorage.signin || 'https://getsearchparty.com/signin'; 
  SIGNUP_URL: string = localStorage.signup || 'https://getsearchparty.com/signup';
  URL_CHECKER_URL: string = localStorage.urlChecker || 'https://getsearchparty.com/urlChecker';
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});
  urls = {
    singleHunt: this.SINGLE_HUNT_URL,
    addChatMessage: this.ADD_MESSAGE_URL,
    getChatMessages: this.GET_MESSAGES_URL,
    feedback: this.FEEDBACK_URL,
    tasks: this.TASKS_URL,
    upload: this.UPLOAD_URL,
    getPics: this.GET_PICS_URL,
    userProfile: this.USER_PROFILE_URL,
    addFriend: this.ADD_FRIEND_URL,
    getFriends: this.GET_FRIENDS_URL,
    addFriendToHunt: this.ADD_FRIEND_TO_HUNT_URL,
    getFriendHunt: this.GET_FRIEND_HUNT_URL,
    getAddedHunts: this.GET_ADDED_HUNTS_URL,
    templates: this.TEMPLATES_URL,
    singleTemplate: this.SINGLE_TEMPLATE_URL,
    signin: this.SIGNIN_URL,
    signup: this.SIGNUP_URL,
    urlChecker: this.URL_CHECKER_URL  
  };
  
  constructor(private _http:Http) {}
  
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
    
    console.log('this is the urlName ', urlName);
    
    console.log('this is the urls ', this.urls);
    
    let url = this.urls[urlName];
    
    console.log('this should be the url from access ', this.urls[urlName]);
    
    console.log('this is the url ', url);
    
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