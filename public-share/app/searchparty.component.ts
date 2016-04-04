import {Component, OnInit} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteParams} from 'angular2/router';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';
import {SearchPartyService} from './searchparty.service';
import {GoogleMapService} from './map.service';
import {ChatComponent} from './chat.component';
import {MapComponent} from './map.component';

@Component({
  selector: 'my-searchparty',
  templateUrl: './share/app/searchparty.component.html',
  styleUrls: ['./share/app/searchparty.component.css'],
  directives: [
      ROUTER_DIRECTIVES, 
      MATERIAL_DIRECTIVES, 
      ChatComponent,
      MapComponent
    ],
  providers: [
      MATERIAL_PROVIDERS, 
      SearchPartyService, 
      GoogleMapService
    ]
})
export class SearchPartyComponent {
  huntID: any;
  error: any;
  huntTasks: any;
  huntChats: any;
  allPlaces: any;
  allTasks: any;
  totalDist: number;
  startLat: number;
  startLng: number;
  content: any;
  socket: any;
  tasks: any;
  io: any;
  chatroom: any;
  username: any;
  previousPlaces: any;
  previousTasks: any;

  constructor(
    private _params: RouteParams, 
    private _googleMaps: GoogleMapService, 
    private _searchPartyService: SearchPartyService
    ) {
    this.huntID = _params.get('huntID');
    this.username = _params.get('username');
    this.allTasks = [];
    this.previousPlaces = [];
    this.previousTasks = [];
    this.getHuntData(this.huntID);
    this._searchPartyService.taskChange.subscribe(tasks => this.allTasks = tasks);
  }
  
  getHuntData(id) {
    this._searchPartyService.getHunt(id);
  }
  
}
