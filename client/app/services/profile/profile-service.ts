import {Injectable} from 'angular2/core';
import {LocalStorage, Storage} from 'ionic-angular';
import {Http, Headers} from 'angular2/http';
import {ConnectionBackend, HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TemplateService {
  PROFILE_URL: string = process.env.TEMPLATESURL || 'http://localhost:8000/profile'; //update this later
  local: Storage = new Storage(LocalStorage);
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});
  
  constructor(private _http:Http) {}

  getProfile(data, userInfo) {
    console.log('called post req');
    let httpPostPromise = new Promise((resolve, reject) => {
      let token = this.local.get('id_token')._result
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
  
  logError(err) {
    console.error('There was an error: ' + err);
  }
}  