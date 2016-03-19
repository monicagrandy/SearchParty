import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';  // we need to import this now

@Injectable()
export class TaskService {
  constructor(private _http:Http) {}
  TASKS_URL: string = process.env.TASKSURL || 'http://localhost:8000/tasks';
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});
  
   postData(data) {
    console.log("called post req")

    let httpPromise = new Promise((resolve, reject) => {
      console.log("inside promise")
      this._http.post(this.TASKS_URL, data, {headers: this.contentHeader})
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
    
    return httpPromise
  }
}


}

