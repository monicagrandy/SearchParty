import {Component, OnInit} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteParams} from 'angular2/router';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';
import {SearchPartyService} from './searchparty-service';
import {GoogleMapService} from './map-service';
import {ChatComponent} from './chat.component';


@Component({
  selector: 'my-map',
  templateUrl: './share/app/map.component.html',
  styleUrls: ['./share/app/map.component.css'],
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES, ChatComponent],
  providers: [MATERIAL_PROVIDERS, SearchPartyService, GoogleMapService]
})
export class MapComponent {
  map = null;

  constructor(
    private _params: RouteParams, 
    private _googleMaps: GoogleMapService, 
    private _searchPartyService: SearchPartyService
    ) {
  }
  
}
