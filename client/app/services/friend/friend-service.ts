import {Injectable} from 'angular2/core';
import {Storage, LocalStorage} from 'ionic-angular';
import {APIService} from '../api/api-service';

@Injectable()
export class FriendService {
  local: Storage = new Storage(LocalStorage);

  constructor(private _apiService:APIService) {}
  
  postData(data, urlName) {
    return this._apiService.postData(data, urlName);
  }
}
