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
    // this._searchPartyService.getHunt(this.huntID);
    // let socket = io.connect(this.SOCKET_URL);
    // this.socket = socket;
    // this.socket.on("connect", () => {
    //   this.socket.emit('huntMapRoom', this.huntID);
    // });
    // this.socket.on('taskChange', (location, task, room, lat, lng, num) => {
    //   console.log(' this is the task change location change ', location);
    //   this.allTasks.unshift([[location], [task]]);
    //   this.socket.emit('chat_message', '::TASK HAS CHANGED::', 'SearchPartyAdmin', null, this.huntID);
    //   this.socket.emit('chat_message', 'challenge completed!', 'Party Bot', Date.now()/1000, this.huntID);
    //   this._searchPartyService.getHunt(this.huntID);
    // });
    // this.socket.on("location", (data, username) => {
    //   let coords = new google.maps.LatLng(data.latitude, data.longitude);
    //   setTimeout(() => this._googleMaps.addCurrentMarker(coords, 'user location')
    //     .then(map => this.map = map), 2000);
    //   console.log('location was updated from socket server ', data, username);
    // });
  }
  
}
