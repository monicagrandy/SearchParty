import {Component, OnInit} from 'angular2/core';
import {Http, ConnectionBackend, HTTP_PROVIDERS, Headers} from 'angular2/http';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteParams} from 'angular2/router';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';
import 'rxjs/add/operator/map';
import * as _ from 'underscore';

@Component({
  selector: 'my-searchparty',
  templateUrl: './share/app/searchparty.component.html',
  styleUrls: ['./share/app/searchparty.component.css'],
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES],
  providers: [
    Http,
    ConnectionBackend,
    HTTP_PROVIDERS,
    MATERIAL_PROVIDERS
  ]
})
export class SearchPartyComponent {
  
  huntID: any;
  
  constructor(private _http:Http, private _params: RouteParams) {
    this._http = _http;
    this.huntID = _params.get('huntID');
  }

}
