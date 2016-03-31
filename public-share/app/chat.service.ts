import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';  // we need to import this now

@Injectable()
export class ChatService {
  constructor(private _http:Http) {}
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});

  postData(data, url) {
    console.log("called post req");

    let httpPromise = new Promise((resolve, reject) => {
      console.log("data inside chat Promise", data);
      this._http.post(url, data, { headers: this.contentHeader })
        .map(res => res.json())
        .subscribe(
        data => {
          console.log("data from promise: ", data);
          resolve(data);
        },
        err => reject(err),
        () => console.log('data recieved')
        )
    })

    return httpPromise;
  }

}