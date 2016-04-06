import {Injectable} from 'angular2/core';
import {Storage, LocalStorage,} from 'ionic-angular';
import {UrlService} from '../url/url-service';
import {APIService} from '../api/api-service';

@Injectable()
export class TemplateService {
  local: Storage = new Storage(LocalStorage);
  TEMPLATES_URL: string = localStorage.templates || 'http://localhost:8000/templates';
  TEMPLATE_URL: string = localStorage.template || 'http://localhost:8000/singleTemplate'
  TASKS_URL: string = localStorage.tasks || 'https://getsearchparty.com/tasks';
  keyword: string;

  constructor(private _apiService:APIService) {}

  getData() {
    console.log('called get req');
    let httpGetPromise = new Promise((resolve, reject) => {
      console.log('inside get promise');
      this._http.get(this.TEMPLATES_URL)
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
  
  postTemplateData(data, urlName) {
    
    let urls = {
      templates: this.TEMPLATES_URL,
      template: this.TEMPLATE_URL,
      tasks: this.TASKS_URL
    };
    
    let url = urls[urlName];
    
    console.log('called post req');
    
    let httpPostPromise = new Promise((resolve, reject) => {
      this._http.post(url, JSON.stringify(data), {headers: this.contentHeader})
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
        
    return httpPostPromise;
  }

  postData(name, keyword, userInfo, taskNumber, templateName) {
    console.log('called post req');
    let httpGetPromise = new Promise((resolve, reject) => {
      console.log('inside post promise');
      console.log('THIS IS THE DATA shold be keyword', keyword)
      console.log("THIS IS THE USER LOCATION IN TEMPLATE SERVICE ", userInfo);
      let currentTime = new Date();

      let dataToSend = {
        keyword: keyword,
        geolocation:  {
          lat: userInfo.userLat,
          lng: userInfo.userLng
        },
        huntName: name,
        token: userInfo.id_token,
        previousPlaces: [],
        previousTasks: [],
        date: currentTime,
        templateName: templateName,
        taskNumber: taskNumber
      };

      console.log("THIS IS THE COMBO DATA BEFORE SENT ", dataToSend);
      this._http.post(this.TASKS_URL, JSON.stringify(dataToSend), {headers: this.contentHeader})
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
