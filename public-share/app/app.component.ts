import {Component, OnInit, ViewChild} from 'angular2/core';
import {Http, ConnectionBackend, HTTP_PROVIDERS, Headers} from 'angular2/http';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';
import {SearchPartyComponent} from './searchparty.component';
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
    MATERIAL_PROVIDERS
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

  constructor() {
    // _.each([1,2,3,], number => console.log(number));
  }

}
