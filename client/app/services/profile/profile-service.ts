import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {ConnectionBackend, HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProfileService {
  PROFILE_URL: string = 'http://localhost:8000/userProfile'; //update this later
  ADDEDHUNTS_URL: string = 'http://localhost:8000/getAddedHunts'
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
    console.log('called addedHunts');
    let httpPostPromise = new Promise((resolve, reject) => {
      console.log('inside post promise - addedHunts');
      let dataToSend = { username: username };

      this._http.post(this.ADDEDHUNTS_URL, JSON.stringify(dataToSend), { headers: this.contentHeader})
      .map(res => res.json())
      .subscribe(
        data => {
          console.log('data from addedHunts: ', data);
          resolve(data)
        },
        err => {
          this.logError(err);
          reject(err);
        },
        () => console.log('data recieved from addedHunts')
        )
      })
    return httpPostPromise
  }

  logError(err) {
    console.error('There was an error: ' + err);
  }
}
