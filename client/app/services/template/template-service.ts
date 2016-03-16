import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {ConnectionBackend, HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TemplateService {
  constructor(private _http:Http) {}
  
  getData() {
    console.log('called get req')
    let httpGetPromise = new Promise((resolve, reject) => {
      console.log('called get req')
      this._http.get('/templates')
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

  postData(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    console.log('called get req')
    let httpGetPromise = new Promise((resolve, reject) => {
      console.log('called get req')
      this._http.post('/tasks', data, {headers: headers})
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
  
  logError(err) {
    console.error('There was an error: ' + err);
  }
}  