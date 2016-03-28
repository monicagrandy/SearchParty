import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';
import {SearchPartyComponent} from './searchparty.component';
import 'rxjs/add/operator/map';
import * as _ from 'underscore';

@Component({
  selector: 'my-app',
  templateUrl: './share/app/app.component.html',
  styleUrls: ['./share/app/app.component.css'],
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES],
  providers: [MATERIAL_PROVIDERS]
})
@RouteConfig([
  {
    path: 'hunt/:huntID',
    name: 'SearchParty',
    component: SearchPartyComponent
  },
])
export class AppComponent {
  title = 'Search Party';

  constructor() {}

}
