import {Storage, LocalStorage} from 'ionic-angular';
import {tokenNotExpired} from 'angular2-jwt';
import {Injectable} from 'angular2/core';
import {APIService} from '../api/api-service';

@Injectable()
export class AuthService {
  local: Storage = new Storage(LocalStorage);
  user: Object;

  constructor(private _apiService:APIService) {
    let profile = this.local.get('profile')._result;
    if (profile) {
      this.user = JSON.parse(profile);
    }
  }
  
  postData(data, urlName) {
    return this._apiService.postData(data, urlName);
  }

  public authenticated() {
    return tokenNotExpired();
  }
  
}
