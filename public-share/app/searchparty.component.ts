import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteParams} from 'angular2/router';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';
import {SearchPartyService} from './searchparty.service';
import 'rxjs/add/operator/map';
import * as _ from 'underscore';

@Component({
  selector: 'my-searchparty',
  templateUrl: './share/app/searchparty.component.html',
  styleUrls: ['./share/app/searchparty.component.css'],
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES],
  providers: [MATERIAL_PROVIDERS, SearchPartyService]
})
export class SearchPartyComponent {
  
  huntID: any;
  error: any;
  
  constructor(private _params: RouteParams, private _searchPartyService: SearchPartyService) {
    this.huntID = _params.get('huntID');
    this._searchPartyService.getHunt(this.huntID)
      .then(data => console.log(data))
        .catch(err => console.log(err));
  }

}
