import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {APIService} from '../api/api-service';


@Injectable()
export class UrlService {
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});
  // change this URL when deploying
  manualUrlToChange: string = 'http://localhost:8000/urlChecker';
  constructor(private _http:Http) {}
  
  grabUrls() {
    console.log('called get req');
    let httpGetPromise = new Promise((resolve, reject) => {
      console.log('inside get promise');
      this._http.get(this.manualUrlToChange)
        .map(res => res.json())
        .subscribe(
          data => {
            console.log('data from URL promise: ', data);
            resolve(data);
          },
          err => {
            reject(err);
          },
          () => console.log('data recieved')
          )
        })
    return httpGetPromise;
  }
}
