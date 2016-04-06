import {Injectable} from 'angular2/core';
import {APIService} from '../api/api-service';


@Injectable()
export class UrlService {
  constructor(private _apiService:APIService) {}
  
  grabUrls() {
    return this._apiService.getData('urlChecker');
  }
}
