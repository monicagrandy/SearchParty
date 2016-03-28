import {Component, OnInit} from 'angular2/core';
import {Http, ConnectionBackend, HTTP_PROVIDERS, Headers} from 'angular2/http';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';
import 'rxjs/add/operator/map';
import * as _ from 'underscore';

@Component({
  selector: 'my-searchparty',
  templateUrl: './huntshare/app/searchparty.component.html',
  styleUrls: ['./huntshare/app/searchparty.component.css'],
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS,
    Http,
    ConnectionBackend,
    HTTP_PROVIDERS,
    MATERIAL_PROVIDERS,
  ]
})
export class SearchPartyComponent {

  constructor(private _http:Http) {
    this._http = _http;
  }

}
