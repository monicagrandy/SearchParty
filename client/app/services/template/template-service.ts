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
    return this._apiService.getData('templates');
  }
  
  postData(data, urlName) {
    console.log('called post req');
    return this._apiService.postData(data, urlName);
  }

}
