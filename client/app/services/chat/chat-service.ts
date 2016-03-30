import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService {
  constructor(private _http:Http) {}
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});

  postData(data, url) {
    let httpPromise = new Promise((resolve, reject) => {
      console.log(data);
      this._http.post(url, data, {headers: this.contentHeader})
      .map(res => res.json())
      .subscribe(
        data => {
          resolve(data);
        },
        err => reject(err),
        () => console.log('data recieved');
      )
    })
    return httpPromise;
  }
}
