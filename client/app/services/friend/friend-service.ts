import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {ConnectionBackend, HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FriendService {
  ADDFRIEND_URL: string = 'http://localhost:8000/addFriend'; //update this later https://getsearchparty.com/addFriend
  GETFRIENDS_URL: string = 'http://localhost:8000/getFriends'; //update this later https://getsearchparty.com/getFriends
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});
  
  constructor(private _http:Http) {}
  
  addFriend(userToken, friend) {
    console.log('called post req');
    let dataToSend = { token: userToken, friendusername: friend.username };
    
    let addFriendPostPromise = new Promise((resolve, reject) => {
      
      this._http.post(this.ADDFRIEND_URL, JSON.stringify(dataToSend), {headers: this.contentHeader})
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
    
    return addFriendPostPromise;
  }
  
  getFriends(userToken) {
    console.log('called post req');
    let dataToSend = { token: userToken };
    
    let getFriendsPostPromise = new Promise((resolve, reject) => {
      
      this._http.post(this.GETFRIENDS_URL, JSON.stringify(dataToSend), {headers: this.contentHeader})
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
    
    return getFriendsPostPromise;
  }
  
  logError(err) {
    console.error('There was an error: ' + err);
  }
}  