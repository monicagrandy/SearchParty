import {Component, OnInit, ViewChild} from 'angular2/core';
import {Http, ConnectionBackend, HTTP_PROVIDERS, Headers} from 'angular2/http';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';
import {SearchPartyComponent} from './searchparty.component';
import {UrlService} from './url-service';
import {APIService} from './api-service';
import {GoogleMapService} from './map.service';
import * as _ from 'underscore';

@Component({
  selector: 'my-app',
  templateUrl: './share/app/app.component.html',
  styleUrls: ['./share/app/app.component.css'],
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES],
  providers: [
    Http,
    ConnectionBackend,
    HTTP_PROVIDERS,
    MATERIAL_PROVIDERS,
    UrlService,
    APIService,
    GoogleMapService
  ]
})
@RouteConfig([
  {
    path: 'hunt/:username/:huntID',
    name: 'SearchParty',
    component: SearchPartyComponent
  },
])
export class AppComponent {
  title = 'Search Party';

  constructor(private _urlService: UrlService) {
    // comment urlService for deployment
    this._urlService.grabUrls()
      .then(urls => {
        for (let key in urls) {
          localStorage.setItem(key, urls[key]);
        }
      });
  }

}
