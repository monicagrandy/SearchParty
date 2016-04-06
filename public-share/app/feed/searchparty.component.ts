import {Component, OnInit} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteParams} from 'angular2/router';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';
import {SearchPartyService} from './searchparty-service';
import {ChatComponent} from '../chat/chat.component';
import {MapComponent} from '../map/map.component';
import {SocketService} from '../shared/socket-service';


@Component({
  selector: 'my-searchparty',
  templateUrl: './share/app/feed/searchparty.component.html',
  styleUrls: ['./share/app/feed/searchparty.component.css'],
  directives: [
      ROUTER_DIRECTIVES, 
      MATERIAL_DIRECTIVES, 
      ChatComponent,
      MapComponent
    ],
  providers: [
      MATERIAL_PROVIDERS, 
      SearchPartyService,
      SocketService
    ]
})
export class SearchPartyComponent {
  huntID: any;
  allTasks: any;
  totalDist: number;
  username: any;

  constructor(
    private _params: RouteParams, 
    private _searchPartyService: SearchPartyService,
    private _socketService: SocketService
    ) {
    this.huntID = _params.get('huntID');
    this.username = _params.get('username');
    this._socketService.createSocket(this.huntID);
    this.getHuntData(this.huntID);
    this._searchPartyService.taskChange.subscribe(tasks => this.allTasks = tasks);
  }
  
  getHuntData(id) {
    this._searchPartyService.getHunt(id);
  }
  
}
