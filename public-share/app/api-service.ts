import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';

@Injectable()
export class APIService {
  SINGLE_HUNT_URL: string = localStorage.singleHunt || 'https://getsearchparty.com/singleHunt'; //update this later
  ADD_MESSAGE_URL: string = localStorage.addChatMessage || 'https://getsearchparty.com/addChatMessage';
  GET_MESSAGES_URL: string = localStorage.getChatMessages || 'https://getsearchparty.com/getChatMessages';
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});
  
  constructor(private _http:Http) {}
  
  getData(dataObj, urlName) {
    
    let urls = {
      hunt: this.SINGLE_HUNT_URL,
      addChatMessage: this.ADD_MESSAGE_URL,
      getChatMessages: this.GET_MESSAGES_URL
    }
    
    let url = urls[urlName];
    
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