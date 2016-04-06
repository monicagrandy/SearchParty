import {Injectable} from 'angular2/core';
import {Storage, LocalStorage} from 'ionic-angular';
import {APIService} from '../api/api-service';

@Injectable()
export class ProfileService {
  local: Storage = new Storage(LocalStorage);

  constructor(private _apiService:APIService) {}

  postData(data, urlName) {
    console.log('called post req');
    return this._apiService.postData(data, urlName);
  }

}
