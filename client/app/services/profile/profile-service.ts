import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {ConnectionBackend, HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProfileService {
  PROFILE_URL: string = 'https://getsearchparty.com/userProfile'; //update this later
  ADDEDHUNTS_URL: string = 'https://getsearchparty.com/getAddedHunts';
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});

  constructor(private _http:Http) {}

  getProfile(token) {
    console.log('called post req');
    let httpPostPromise = new Promise((resolve, reject) => {
      console.log('inside post promise');
      let dataToSend = { token: token };

      this._http.post(this.PROFILE_URL, JSON.stringify(dataToSend), {headers: this.contentHeader})
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
    return httpPostPromise;
  }

  addedHunts(username) {
    console.log('called addedHunts post req');
    console.log('inside addedHunts post promise');
    let dataToSend = { username: username };
    console.log('this is the data to send ', dataToSend);
    let httpPostPromise = new Promise((resolve, reject) => {
      this._http.post(this.ADDEDHUNTS_URL, JSON.stringify(dataToSend), {headers: this.contentHeader})
        .map(res => res.json())
        .subscribe(
          data => {
            console.log('data from promise: ', data);
            resolve(data);
          },
          err => {
            console.log(err);
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
