import { Component, OnInit } from 'angular2/core';
import { Http, ConnectionBackend, HTTP_PROVIDERS, Headers } from 'angular2/http';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import { MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS } from "ng2-material/all";
import 'rxjs/add/operator/map';

@Component({
  selector: 'my-app',
  templateUrl: './huntshare/app/app.component.html',
  styleUrls: ['./huntshare/app/app.component.css'],
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS,
    Http,
    ConnectionBackend,
    HTTP_PROVIDERS,
    MATERIAL_PROVIDERS,
  ]
})
@RouteConfig([

])
export class AppComponent {
  title = 'Search Party';

  constructor(
    private _http:Http
    ) {
    this._http = _http;
  }

}
