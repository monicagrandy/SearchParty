import {Component, OnInit} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteParams} from 'angular2/router';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';
import {GoogleMapService} from './map-service';


@Component({
  selector: 'my-map',
  templateUrl: './share/app/map/map.component.html',
  styleUrls: ['./share/app/map/map.component.css'],
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES],
  providers: [MATERIAL_PROVIDERS, GoogleMapService]
})
export class MapComponent {
  map = null;

  constructor(
    private _params: RouteParams, 
    private _googleMaps: GoogleMapService 
    ) {
  }
  
}
