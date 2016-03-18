import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {ConnectionBackend, HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TaskService {
  constructor(private _http:Http) {}
  TASKS_URL: string = process.env.TASKSURL || 'http://localhost:8000/tasks';

  postData(data){
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let httpGetPromise = new Promise((resolve, reject) => {
      this._http.post(this.TASKS_URL, data, {headers: headers})
        .map(res => res.json())
        .subscribe(
          data => {
            console.log("data from promise: ", data)
            resolve(data)
          },
          err => reject(err),
          () => console.log('data recieved')
          )
        })
    return httpGetPromise
  }  

}

